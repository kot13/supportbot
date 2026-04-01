export type TelegramSendInput = {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
};

export type TelegramSendResult =
  | { ok: true; telegramMessageId?: number }
  | { ok: false; errorCode?: string; errorMessage: string };

export async function sendTelegramMessage(input: TelegramSendInput): Promise<TelegramSendResult> {
  // Lazy import to avoid env/db access at build time.
  const { getBotSettings } = await import("@/src/db/botSettings");
  const settings = await getBotSettings();

  const token = settings.bot_token_secret;
  if (!token) {
    return { ok: false, errorCode: "BOT_TOKEN_NOT_SET", errorMessage: "Bot token is not set" };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: input.chatId,
        text: input.text,
        parse_mode: input.parseMode,
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    const json = (await res.json().catch(() => null)) as
      | { ok: true; result?: { message_id?: number } }
      | { ok: false; error_code?: number; description?: string }
      | null;

    if (!res.ok || !json || json.ok !== true) {
      const errCode =
        json && json.ok === false && typeof json.error_code === "number"
          ? String(json.error_code)
          : res.status
            ? String(res.status)
            : "TELEGRAM_ERROR";
      const errMsg =
        json && json.ok === false && typeof json.description === "string"
          ? json.description
          : "Telegram send failed";

      return { ok: false, errorCode: errCode, errorMessage: errMsg };
    }

    return { ok: true, telegramMessageId: json.result?.message_id };
  } catch (err) {
    if ((err as { name?: string }).name === "AbortError") {
      return { ok: false, errorCode: "TIMEOUT", errorMessage: "Telegram request timed out" };
    }
    return { ok: false, errorCode: "NETWORK_ERROR", errorMessage: "Telegram request failed" };
  } finally {
    clearTimeout(timeout);
  }
}

