import { getChatByTelegramId } from "@/src/db/chats";
import { insertChatMessage, listRecentChatMessages, markMessageUnanswered } from "@/src/db/chatMessages";
import { countKnowledgeChunks } from "@/src/db/knowledgeChunks";
import { tryMarkProcessed } from "@/src/db/processedTelegramUpdates";
import { logger } from "@/src/observability/logger";
import {
  answerQuestion,
  OPENAI_ERROR_MESSAGE,
} from "@/src/rag/answer";
import { getKnowledgeIndexStatus } from "@/src/rag/knowledgeIndexStatus";
import { retrieveContext } from "@/src/rag/retrieve";
import { buildUnansweredContextSnapshot } from "@/src/rag/unansweredSnapshot";
import type { RecentMessage } from "@/src/rag/prompts";
import type { RetrievedChunk } from "@/src/db/knowledgeChunks";

import { getBotUsername } from "./botIdentity";
import { markdownToTelegramHtml, sanitizeMarkdownForTelegram } from "./markdownToTelegramHtml";
import { sendTelegramMessage, splitLongTelegramText } from "./send";
import type { TelegramUpdate } from "./updates";
import { isAddressedToBot, isHelpIntent, isStartCommand, normalizeIncomingMessage, stripBotMentionFromText } from "./updates";

const OUTDATED_INDEX_MESSAGE =
  "База знаний требует переиндексации после смены модели эмбеддингов. Администратор может выполнить переиндексацию в настройках бота.";

const START_GREETING =
  "Привет! Я бот поддержки InAppStory.\n\nЗадайте вопрос по документации SDK или API — постараюсь ответить на основе базы знаний.";

const HELP_TOPICS_REPLY =
  "Я отвечаю на вопросы по документации InAppStory на основе базы знаний. Могу помочь с темами:\n\n" +
  "• SDK — интеграция и настройка (Android, iOS, Flutter, React Native, JS/React)\n" +
  "• Консоль — создание сторис, редактор, роли, публикация, статистика\n" +
  "• API — публичное REST API (эндпоинты, параметры, примеры)\n\n" +
  "Задайте конкретный вопрос по одной из тем — например: «Как подключить SDK на Android?» или «Как опубликовать сторис?»";

function chatContextLimit(): number {
  const raw = process.env.CHAT_CONTEXT_LIMIT?.trim();
  const n = raw ? Number(raw) : 10;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 50) : 10;
}

export async function processIncomingMessage(update: TelegramUpdate): Promise<void> {
  const incoming = normalizeIncomingMessage(update);
  if (!incoming) return;

  const isNew = await tryMarkProcessed(incoming.updateId);
  if (!isNew) return;

  const botUsername = await getBotUsername();
  if (!isAddressedToBot(incoming, botUsername)) {
    if (incoming.chatType !== "private") {
      logger.info("message_not_addressed_to_bot", {
        chatType: incoming.chatType,
        mentions: incoming.mentionUsernames,
        botUsername,
      });
    }
    return;
  }

  const chat = await getChatByTelegramId(incoming.telegramChatId);
  if (!chat) {
    logger.warn("process_message_chat_missing", { telegramChatId: incoming.telegramChatId });
    return;
  }

  const userMessage = await insertChatMessage({
    chatId: chat.id,
    role: "user",
    content: incoming.text,
    telegramMessageId: incoming.telegramMessageId,
    telegramUserId: incoming.telegramUserId,
    telegramUsername: incoming.telegramUsername,
    telegramUserFirstName: incoming.telegramUserFirstName,
  });

  const textForIntent = stripBotMentionFromText(incoming.text, botUsername);

  if (isStartCommand(textForIntent)) {
    await sendBotReply(chat.id, incoming.telegramChatId, START_GREETING, incoming.telegramMessageId);
    return;
  }

  if (isHelpIntent(textForIntent)) {
    await sendBotReply(chat.id, incoming.telegramChatId, HELP_TOPICS_REPLY, incoming.telegramMessageId);
    return;
  }

  const chunkCount = await countKnowledgeChunks();
  const indexStatus = await getKnowledgeIndexStatus();
  let unansweredReason: string | null = null;
  let replyText: string;
  let chunks: RetrievedChunk[] = [];
  let recentMessages: RecentMessage[] = [];
  let searchPerformed = false;

  if (chunkCount === 0 || indexStatus.state === "never_indexed") {
    unansweredReason = "no_knowledge_index";
    replyText =
      "База знаний ещё не проиндексирована. Администратор должен выполнить команду индексации (rag:index).";
  } else if (indexStatus.state === "outdated") {
    unansweredReason = "no_knowledge_index";
    replyText = OUTDATED_INDEX_MESSAGE;
  } else {
    const recentRows = await listRecentChatMessages(chat.id, chatContextLimit());
    recentMessages = recentRows.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const questionForRag = stripBotMentionFromText(incoming.text, botUsername);
      searchPerformed = true;
      chunks = await retrieveContext(questionForRag);
      const result = await answerQuestion({
        question: questionForRag,
        chunks,
        recentMessages,
      });

      if (!result.ok) {
        unansweredReason = result.reason;
        replyText = result.message;
        logger.info("bot_answer_fallback", { reason: result.reason, chatId: chat.id });
      } else {
        replyText = result.answer;
      }
    } catch (err) {
      unansweredReason = "openai_error";
      logger.warn("bot_answer_error", {
        chatId: chat.id,
        error: err instanceof Error ? err.message : "unknown",
      });
      replyText = OPENAI_ERROR_MESSAGE;
    }
  }

  await sendBotReply(chat.id, incoming.telegramChatId, replyText, incoming.telegramMessageId);

  if (unansweredReason) {
    const snapshot = buildUnansweredContextSnapshot({
      searchPerformed,
      chunks,
      recentMessages,
    });
    await markMessageUnanswered(userMessage.id, unansweredReason, snapshot);
  }
}

async function sendBotReply(
  internalChatId: number,
  telegramChatId: string,
  text: string,
  replyToMessageId?: number,
): Promise<void> {
  const sanitized = sanitizeMarkdownForTelegram(text);
  const parts = splitLongTelegramText(sanitized);
  let lastTelegramMessageId: number | undefined;

  for (const [index, part] of parts.entries()) {
    const replyTo = index === 0 ? replyToMessageId : undefined;
    const html = markdownToTelegramHtml(part);
    let sent = await sendTelegramMessage({
      chatId: telegramChatId,
      text: html,
      parseMode: "HTML",
      replyToMessageId: replyTo,
    });
    if (!sent.ok) {
      sent = await sendTelegramMessage({
        chatId: telegramChatId,
        text: part,
        replyToMessageId: replyTo,
      });
    }
    if (!sent.ok) {
      logger.warn("bot_send_failed", {
        chatId: internalChatId,
        errorCode: sent.errorCode,
        errorMessage: sent.errorMessage,
      });
      if (parts.length === 1) {
        await sendTelegramMessage({
          chatId: telegramChatId,
          text: OPENAI_ERROR_MESSAGE,
          replyToMessageId: replyTo,
        });
      }
      return;
    }
    lastTelegramMessageId = sent.telegramMessageId;
  }

  // Persist Telegram-compatible Markdown (sanitized, not raw model output or HTML).
  await insertChatMessage({
    chatId: internalChatId,
    role: "bot",
    content: sanitized,
    telegramMessageId: lastTelegramMessageId ?? null,
  });
}
