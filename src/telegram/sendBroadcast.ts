import type { TelegramImageInput } from "./sendPhoto";
import type { TelegramSendResult } from "./send";

import { sendTelegramMessage } from "./send";
import { sendTelegramPhoto } from "./sendPhoto";
import { sendTelegramMediaGroup } from "./sendMediaGroup";

export type TelegramBroadcastInput = {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
  images?: TelegramImageInput[];
};

export async function sendTelegramBroadcast(
  input: TelegramBroadcastInput,
): Promise<TelegramSendResult> {
  const images = input.images ?? [];

  if (images.length === 0) {
    return await sendTelegramMessage({ chatId: input.chatId, text: input.text, parseMode: input.parseMode });
  }

  if (images.length === 1) {
    const r = await sendTelegramPhoto({
      chatId: input.chatId,
      photo: images[0]!,
      caption: input.text,
      parseMode: input.parseMode,
    });
    return r.ok
      ? { ok: true, telegramMessageId: r.telegramMessageId }
      : { ok: false, errorCode: r.errorCode, errorMessage: r.errorMessage };
  }

  const r = await sendTelegramMediaGroup({
    chatId: input.chatId,
    photos: images.slice(0, 10),
    caption: input.text,
    parseMode: input.parseMode,
  });
  return r.ok
    ? { ok: true, telegramMessageId: r.telegramMessageIds[0] }
    : { ok: false, errorCode: r.errorCode, errorMessage: r.errorMessage };
}

