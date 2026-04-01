/**
 * Calls Telegram Bot API setWebhook. Does not log or return the bot token.
 */
export async function registerTelegramWebhook(input: {
  botToken: string;
  webhookUrl: string;
  secretToken?: string | null;
}): Promise<{ ok: true } | { ok: false; errorMessage: string }> {
  const token = input.botToken.trim();
  if (!token) {
    return { ok: false, errorMessage: "Bot token is not configured" };
  }

  const body: Record<string, unknown> = {
    url: input.webhookUrl,
  };
  if (input.secretToken && input.secretToken.trim()) {
    body.secret_token = input.secretToken.trim();
  }

  let res: Response;
  try {
    res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/setWebhook`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, errorMessage: "Could not reach Telegram. Check network and try again." };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { ok: false, errorMessage: "Invalid response from Telegram" };
  }

  const obj = json && typeof json === "object" ? (json as Record<string, unknown>) : null;
  const ok = obj?.ok === true;
  if (ok) {
    return { ok: true };
  }

  const desc =
    typeof obj?.description === "string"
      ? obj.description
      : "Telegram rejected the webhook request";
  return { ok: false, errorMessage: sanitizeTelegramErrorDescription(desc) };
}

/** Avoid echoing URLs that might contain sensitive query params (defensive). */
function sanitizeTelegramErrorDescription(description: string): string {
  if (description.length > 500) {
    return `${description.slice(0, 500)}…`;
  }
  return description;
}
