import { AppError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";
import { getBotSettings } from "@/src/db/botSettings";
import { listChats } from "@/src/db/chats";
import { addBroadcastRecipients, updateBroadcastStatus } from "@/src/db/broadcasts";
import { insertBroadcastAttachments } from "@/src/db/broadcastAttachments";
import { upsertDeliveryResult } from "@/src/db/deliveryResults";
import { dispatchQueue } from "@/src/telegram/dispatchQueue";
import { toAdminFriendlyTelegramError } from "@/src/telegram/errors";
import type { TelegramImageInput } from "@/src/telegram/sendPhoto";
import { validateBroadcastImages } from "./validateImages";

export async function sendBroadcast(input: {
  broadcastMessageId: number;
  content: string;
  format: "html" | "plain";
  targetMode: "all" | "subset";
  chatIds?: string[];
  images?: TelegramImageInput[];
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
      : (() => {
          const wanted = new Set((input.chatIds ?? []).map((v) => String(v)));
          return allChats.filter((c) => wanted.has(String(c.id)) || wanted.has(c.telegram_chat_id));
        })();

  if (selected.length === 0) {
    throw new AppError("No recipients selected", { code: "NO_RECIPIENTS", status: 400 });
  }

  const images = input.images ?? [];
  const v = validateBroadcastImages({
    content: input.content,
    images: images.map((img) => ({ mimeType: img.mimeType })),
  });
  if (!v.ok) {
    throw new AppError(v.message, { code: v.code, status: 400 });
  }

  await addBroadcastRecipients(
    input.broadcastMessageId,
    selected.map((c) => c.id),
  );

  if (images.length > 0) {
    try {
      await insertBroadcastAttachments(
        images.map((img, ordinal) => ({
          broadcastMessageId: input.broadcastMessageId,
          ordinal,
          originalFilename: img.filename,
          mimeType: img.mimeType,
          sizeBytes: img.bytes.byteLength,
          telegramFileId: null,
        })),
      );
    } catch {
      throw new AppError(
        "Database is not migrated for image broadcasts. Run migrations (npm run db:migrate) and retry.",
        { code: "DB_NOT_MIGRATED", status: 500 },
      );
    }
  }

  await updateBroadcastStatus(input.broadcastMessageId, { status: "sending", sentAt: new Date() });

  const queueInputs = selected.map((c) => ({
    chatId: c.telegram_chat_id,
    text: input.content,
    parseMode: input.format === "html" ? ("HTML" as const) : undefined,
    images: images.length > 0 ? images : undefined,
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

