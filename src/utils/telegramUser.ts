export function formatTelegramUserDisplayName(input: {
  firstName?: string | null;
  username?: string | null;
  telegramUserId?: number | null;
  fallback?: string | null;
}): string {
  const firstName = input.firstName?.trim();
  if (firstName) return firstName;

  const username = input.username?.trim();
  if (username) return `@${username}`;

  if (input.telegramUserId) return `User ${input.telegramUserId}`;

  const fallback = input.fallback?.trim();
  if (fallback) return fallback;

  return "User";
}

export function telegramUserHref(input: {
  username?: string | null;
  telegramUserId?: number | null;
}): string | null {
  const username = input.username?.trim();
  if (username) return `https://t.me/${username}`;

  if (input.telegramUserId) return `tg://user?id=${input.telegramUserId}`;

  return null;
}
