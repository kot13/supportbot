import { getBotSettings } from "@/src/db/botSettings";
import { logger } from "@/src/observability/logger";

import { handleTelegramUpdate } from "./handleUpdate";

type TgResponse<T> = { ok: true; result: T } | { ok: false; description?: string };

export async function runLongPolling(opts?: { once?: boolean }) {
  const settings = await getBotSettings();
  const token = settings.bot_token_secret;
  if (!token) {
    throw new Error("Bot token is not set in DB. Set it in /bot first.");
  }

  let offset: number | undefined;

  while (true) {
    const url = new URL(`https://api.telegram.org/bot${token}/getUpdates`);
    url.searchParams.set("timeout", "30");
    if (offset !== undefined) url.searchParams.set("offset", String(offset));

    const res = await fetch(url, { method: "GET" });
    const json = (await res.json()) as TgResponse<Array<{ update_id: number } & Record<string, unknown>>>;

    if (!json.ok) {
      logger.warn("telegram_poll_failed", { description: json.description });
      if (opts?.once) return;
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    for (const upd of json.result) {
      offset = upd.update_id + 1;
      await handleTelegramUpdate(upd);
    }

    if (opts?.once) return;
  }
}

if (process.argv[1]?.includes("pollingRunner")) {
  runLongPolling().catch((e) => {
    logger.error("telegram_poll_runner_failed", { error: String(e) });
    process.exitCode = 1;
  });
}

