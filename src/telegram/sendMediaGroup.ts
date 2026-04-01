import { getTelegramBotToken } from "./botToken";
import type { TelegramImageInput } from "./sendPhoto";

export type TelegramSendMediaGroupInput = {
  chatId: string | number;
  photos: TelegramImageInput[]; // 2-10
  caption?: string;
  parseMode?: "HTML" | "MarkdownV2";
};

export type TelegramSendMediaGroupResult =
  | { ok: true; telegramMessageIds: number[]; telegramFileIds: string[] }
  | { ok: false; errorCode?: string; errorMessage: string };

export async function sendTelegramMediaGroup(
  input: TelegramSendMediaGroupInput,
): Promise<TelegramSendMediaGroupResult> {
  const token = await getTelegramBotToken();
  if (!token) {
    return { ok: false, errorCode: "BOT_TOKEN_NOT_SET", errorMessage: "Bot token is not set" };
  }

  if (input.photos.length < 2 || input.photos.length > 10) {
    return {
      ok: false,
      errorCode: "VALIDATION",
      errorMessage: "Media group must include 2-10 images",
    };
  }

  const url = `https://api.telegram.org/bot${token}/sendMediaGroup`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const form = new FormData();
    form.append("chat_id", String(input.chatId));

    const media = input.photos.map((p, idx) => {
      const attachName = `file${idx}`;
      const m: Record<string, unknown> = {
        type: "photo",
        media: `attach://${attachName}`,
      };
      if (idx === 0 && input.caption) {
        m.caption = input.caption;
        if (input.parseMode) m.parse_mode = input.parseMode;
      }
      return m;
    });

    form.append("media", JSON.stringify(media));

    input.photos.forEach((p, idx) => {
      const blob = new Blob([p.bytes.buffer as ArrayBuffer], { type: p.mimeType });
      form.append(`file${idx}`, blob, p.filename);
    });

    const res = await fetch(url, { method: "POST", body: form, signal: controller.signal });
    const json = (await res.json().catch(() => null)) as
      | {
          ok: true;
          result?: Array<{
            message_id?: number;
            photo?: Array<{ file_id?: string }>;
          }>;
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
          : "Telegram sendMediaGroup failed";
      return { ok: false, errorCode: errCode, errorMessage: errMsg };
    }

    const ids = (json.result ?? [])
      .map((m) => m.message_id)
      .filter((v): v is number => typeof v === "number");
    const fileIds = (json.result ?? [])
      .flatMap((m) => m.photo ?? [])
      .map((p) => p.file_id)
      .filter((v): v is string => typeof v === "string");

    return { ok: true, telegramMessageIds: ids, telegramFileIds: fileIds };
  } catch (err) {
    if ((err as { name?: string }).name === "AbortError") {
      return { ok: false, errorCode: "TIMEOUT", errorMessage: "Telegram request timed out" };
    }
    return { ok: false, errorCode: "NETWORK_ERROR", errorMessage: "Telegram request failed" };
  } finally {
    clearTimeout(timeout);
  }
}

