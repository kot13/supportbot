import type { TelegramSendResult } from "./send";

export function toAdminFriendlyTelegramError(result: TelegramSendResult): {
  errorCode?: string;
  errorMessage: string;
} {
  if (result.ok) {
    return { errorMessage: "" };
  }

  const raw = result.errorMessage || "Telegram error";
  const lower = raw.toLowerCase();
  const normalized =
    lower.includes("caption") && (lower.includes("too long") || lower.includes("is too long"))
      ? "Telegram rejected the caption as too long. Reduce message length or send without images."
      : raw;

  const msg = normalized.slice(0, 500);
  const code = result.errorCode?.slice(0, 64);

  return {
    errorCode: code,
    errorMessage: msg,
  };
}

