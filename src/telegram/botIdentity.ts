let cachedUsername: string | null | undefined;

export function setBotUsernameForTests(username: string | null): void {
  cachedUsername = username;
}

export async function getBotUsername(): Promise<string | null> {
  const envUser = process.env.TELEGRAM_BOT_USERNAME?.trim();
  if (envUser) return envUser.replace(/^@/, "");

  if (cachedUsername !== undefined) return cachedUsername;

  const { getBotSettings } = await import("@/src/db/botSettings");
  const settings = await getBotSettings();
  const token = settings.bot_token_secret;
  if (!token) {
    cachedUsername = null;
    return null;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const json = (await res.json()) as {
      ok?: boolean;
      result?: { username?: string };
    };
    cachedUsername = json.ok && json.result?.username ? json.result.username : null;
  } catch {
    cachedUsername = null;
  }
  return cachedUsername;
}
