import type { TelegramSendResult } from "./send";
import type { TelegramBroadcastInput } from "./sendBroadcast";

import { sendTelegramBroadcast } from "./sendBroadcast";

export async function dispatchQueue(
  inputs: TelegramBroadcastInput[],
  opts?: { concurrency?: number },
): Promise<TelegramSendResult[]> {
  // v1: sequential dispatch (safe default). Add concurrency later if needed.
  void opts;
  const out: TelegramSendResult[] = [];
  for (const input of inputs) {
    out.push(await sendTelegramBroadcast(input));
  }
  return out;
}

