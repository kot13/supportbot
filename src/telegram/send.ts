export type TelegramSendInput = {
  chatId: string | number;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
};

export type TelegramSendResult =
  | { ok: true; telegramMessageId?: number }
  | { ok: false; errorCode?: string; errorMessage: string };

export async function sendTelegramMessage(input: TelegramSendInput): Promise<TelegramSendResult> {
  void input;
  return {
    ok: false,
    errorCode: "NOT_IMPLEMENTED",
    errorMessage: "Telegram send adapter is not implemented yet.",
  };
}

