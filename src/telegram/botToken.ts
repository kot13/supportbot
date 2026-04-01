export async function getTelegramBotToken(): Promise<string | null> {
  // Lazy import to avoid env/db access at build time.
  const { getBotSettings } = await import("@/src/db/botSettings");
  const settings = await getBotSettings();
  return settings.bot_token_secret ?? null;
}

