import { AppError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";
import { getBotSettings } from "@/src/db/botSettings";
import { listChats } from "@/src/db/chats";
import { addBroadcastRecipients, updateBroadcastStatus } from "@/src/db/broadcasts";
import { upsertDeliveryResult } from "@/src/db/deliveryResults";
import { dispatchQueue } from "@/src/telegram/dispatchQueue";
import { toAdminFriendlyTelegramError } from "@/src/telegram/errors";

export async function sendBroadcast(input: {
  broadcastMessageId: number;
  content: string;
  format: "html" | "plain";
  targetMode: "all" | "subset";
  chatIds?: number[];
}) {
  if (!input.content.trim()) {
    throw new AppError("Message content is required", { code: "VALIDATION", status: 400 });
  }

  const settings = await getBotSettings();
  if (!settings.bot_token_secret) {
    throw new AppError("Bot token is not set", { code: "BOT_TOKEN_NOT_SET", status: 400 });
  }

  const allChats = await listChats();
  if (allChats.length === 0) {
    throw new AppError("No chats available", { code: "NO_CHATS", status: 400 });
  }

  const selected =
    input.targetMode === "all"
      ? allChats
      : allChats.filter((c) => (input.chatIds ?? []).includes(c.id));

  if (selected.length === 0) {
    throw new AppError("No recipients selected", { code: "NO_RECIPIENTS", status: 400 });
  }

  await addBroadcastRecipients(
    input.broadcastMessageId,
    selected.map((c) => c.id),
  );

  await updateBroadcastStatus(input.broadcastMessageId, { status: "sending", sentAt: new Date() });

  const queueInputs = selected.map((c) => ({
    chatId: c.telegram_chat_id,
    text: input.content,
    parseMode: input.format === "html" ? ("HTML" as const) : undefined,
  }));

  const results = await dispatchQueue(queueInputs, { concurrency: 1 });

  for (let i = 0; i < selected.length; i += 1) {
    const chat = selected[i]!;
    const result = results[i]!;

    if (result.ok) {
      await upsertDeliveryResult({
        broadcastMessageId: input.broadcastMessageId,
        chatId: chat.id,
        status: "success",
        attemptCount: 1,
        sentAt: new Date(),
        telegramMessageId: result.telegramMessageId ?? null,
      });
    } else {
      const e = toAdminFriendlyTelegramError(result);
      await upsertDeliveryResult({
        broadcastMessageId: input.broadcastMessageId,
        chatId: chat.id,
        status: "failure",
        attemptCount: 1,
        sentAt: new Date(),
        errorCode: e.errorCode ?? null,
        errorMessage: e.errorMessage,
      });
    }
  }

  const successCount = results.filter((r) => r.ok).length;
  const failureCount = results.length - successCount;

  logger.info("broadcast_completed", {
    broadcastMessageId: input.broadcastMessageId,
    successCount,
    failureCount,
  });

  await updateBroadcastStatus(input.broadcastMessageId, { status: "completed" });

  return {
    successCount,
    failureCount,
    recipientsTotal: selected.length,
  };
}

