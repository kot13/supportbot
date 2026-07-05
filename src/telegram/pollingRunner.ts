import "dotenv/config";

import { pathToFileURL } from "node:url";

import { getBotSettings } from "@/src/db/botSettings";
import { logger } from "@/src/observability/logger";

import { handleTelegramUpdate } from "./handleUpdate";

type TgResponse<T> = { ok: true; result: T } | { ok: false; description?: string };

function isPollingRunnerMain(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  if (entry.includes("pollingRunner")) return true;
  try {
    return import.meta.url === pathToFileURL(entry).href;
  } catch {
    return false;
  }
}

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
      const description = json.description ?? "unknown";
      logger.warn("telegram_poll_failed", { description });
      if (description.includes("Conflict")) {
        logger.error("telegram_poll_conflict", {
          hint: "Stop other getUpdates/webhook consumers for this bot token, then restart polling.",
        });
        if (opts?.once) return;
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      if (opts?.once) return;
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    if (json.result.length > 0) {
      logger.info("telegram_poll_batch", { count: json.result.length, offset });
    }

    for (const upd of json.result) {
      offset = upd.update_id + 1;
      await handleTelegramUpdate(upd);
    }

    if (opts?.once) return;
  }
}

async function main() {
  logger.info("telegram_poll_started", {
    pid: process.pid,
    hint: "Send a message to your bot in Telegram; only one polling process may run per token.",
  });
  await runLongPolling();
}

if (isPollingRunnerMain()) {
  main().catch((e) => {
    logger.error("telegram_poll_runner_failed", { error: String(e) });
    process.exitCode = 1;
  });
}

