import type { TelegramImageInput } from "./sendPhoto";
import type { TelegramSendResult } from "./send";
import type { TelegramVideoInput } from "./sendVideo";

import { sendTelegramMessage } from "./send";
import { sendTelegramPhoto } from "./sendPhoto";
import { sendTelegramMediaGroup, sendTelegramVideoMediaGroup } from "./sendMediaGroup";
import { sendTelegramVideo } from "./sendVideo";

export type TelegramBroadcastInput = {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
  images?: TelegramImageInput[];
  videos?: TelegramVideoInput[];
};

export async function sendTelegramBroadcast(
  input: TelegramBroadcastInput,
): Promise<TelegramSendResult> {
  const images = input.images ?? [];
  const videos = input.videos ?? [];

  if (images.length > 0 && videos.length > 0) {
    return {
      ok: false,
      errorCode: "VALIDATION",
      errorMessage: "Cannot send images and videos in the same broadcast message",
    };
  }

  if (videos.length > 0) {
    if (videos.length === 1) {
      const r = await sendTelegramVideo({
        chatId: input.chatId,
        video: videos[0]!,
        caption: input.text,
        parseMode: input.parseMode,
      });
      return r.ok
        ? { ok: true, telegramMessageId: r.telegramMessageId }
        : { ok: false, errorCode: r.errorCode, errorMessage: r.errorMessage };
    }

    const r = await sendTelegramVideoMediaGroup({
      chatId: input.chatId,
      videos: videos.slice(0, 10),
      caption: input.text,
      parseMode: input.parseMode,
    });
    return r.ok
      ? { ok: true, telegramMessageId: r.telegramMessageIds[0] }
      : { ok: false, errorCode: r.errorCode, errorMessage: r.errorMessage };
  }

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

