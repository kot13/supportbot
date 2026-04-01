import { upsertChat } from "@/src/db/chats";
import { logger } from "@/src/observability/logger";

import type { TelegramUpdate } from "./updates";
import { normalizeUpdateToChat } from "./updates";

export async function handleTelegramUpdate(update: TelegramUpdate) {
  const chat = normalizeUpdateToChat(update);
  if (!chat) return { ok: true, upserted: false };

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

  return { ok: true, upserted: true };
}
