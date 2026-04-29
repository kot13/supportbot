import { getTelegramBotToken } from "./botToken";

export type TelegramVideoInput = {
  filename: string;
  mimeType: string;
  bytes: Uint8Array;
};

export type TelegramSendVideoInput = {
  chatId: string | number;
  video: TelegramVideoInput;
  caption?: string;
  parseMode?: "HTML" | "MarkdownV2";
};

export type TelegramSendVideoResult =
  | { ok: true; telegramMessageId?: number; telegramFileId?: string }
  | { ok: false; errorCode?: string; errorMessage: string };

export async function sendTelegramVideo(input: TelegramSendVideoInput): Promise<TelegramSendVideoResult> {
  const token = await getTelegramBotToken();
  if (!token) {
    return { ok: false, errorCode: "BOT_TOKEN_NOT_SET", errorMessage: "Bot token is not set" };
  }

  const url = `https://api.telegram.org/bot${token}/sendVideo`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  try {
    const form = new FormData();
    form.append("chat_id", String(input.chatId));
    if (input.caption) form.append("caption", input.caption);
    if (input.parseMode) form.append("parse_mode", input.parseMode);
    form.append("disable_web_page_preview", "true");

    const blob = new Blob([input.video.bytes.buffer as ArrayBuffer], { type: input.video.mimeType });
    form.append("video", blob, input.video.filename);

    const res = await fetch(url, { method: "POST", body: form, signal: controller.signal });
    const json = (await res.json().catch(() => null)) as
      | {
          ok: true;
          result?: {
            message_id?: number;
            video?: { file_id?: string };
          };
        }
      | { ok: false; error_code?: number; description?: string }
      | null;

    if (!res.ok || !json || json.ok !== true) {
      const errCode =
        json && json.ok === false && typeof json.error_code === "number"
          ? String(json.error_code)
          : String(res.status);
      const errMsg =
        json && json.ok === false && typeof json.description === "string"
          ? json.description
          : "Telegram sendVideo failed";
      return { ok: false, errorCode: errCode, errorMessage: errMsg };
    }

    const fileId = json.result?.video?.file_id;
    return {
      ok: true,
      telegramMessageId: json.result?.message_id,
      telegramFileId: fileId,
    };
  } catch (err) {
    if ((err as { name?: string }).name === "AbortError") {
      return { ok: false, errorCode: "TIMEOUT", errorMessage: "Telegram request timed out" };
    }
    return { ok: false, errorCode: "NETWORK_ERROR", errorMessage: "Telegram request failed" };
  } finally {
    clearTimeout(timeout);
  }
}
