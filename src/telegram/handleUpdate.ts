import { upsertChat } from "@/src/db/chats";
import { logger } from "@/src/observability/logger";

import { processIncomingMessage } from "./processMessage";
import type { TelegramUpdate } from "./updates";
import { normalizeIncomingMessage, normalizeUpdateToChat } from "./updates";

export async function handleTelegramUpdate(update: TelegramUpdate) {
  const chat = normalizeUpdateToChat(update);
  if (chat) {
    await upsertChat({
      telegramChatId: chat.telegramChatId,
      title: chat.title,
      type: chat.type,
      isActive: chat.isActive,
      lastSeenAt: chat.lastSeenAt,
    });

    logger.info("chat_upserted", {
      telegramChatId: chat.telegramChatId,
      type: chat.type,
      isActive: chat.isActive,
    });
  }

  if (normalizeIncomingMessage(update)) {
    void processIncomingMessage(update).catch((err) => {
      logger.warn("process_incoming_message_failed", {
        error: err instanceof Error ? err.message : "unknown",
      });
    });
  }

  return { ok: true, upserted: Boolean(chat) };
}
