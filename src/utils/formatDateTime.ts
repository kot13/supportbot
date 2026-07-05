const CHAT_DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Europe/Moscow",
};

/** Stable locale + timezone for SSR and client (avoids hydration mismatch). */
export function formatChatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("ru-RU", CHAT_DATETIME_FORMAT);
}
