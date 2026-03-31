import type { TelegramSendResult } from "./send";

export function toAdminFriendlyTelegramError(result: TelegramSendResult): {
  errorCode?: string;
  errorMessage: string;
} {
  if (result.ok) {
    return { errorMessage: "" };
  }

  const msg = (result.errorMessage || "Telegram error").slice(0, 500);
  const code = result.errorCode?.slice(0, 64);

  return {
    errorCode: code,
    errorMessage: msg,
  };
}

