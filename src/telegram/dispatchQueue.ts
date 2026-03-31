import type { TelegramSendInput, TelegramSendResult } from "./send";

import { sendTelegramMessage } from "./send";

export async function dispatchQueue(
  inputs: TelegramSendInput[],
  opts?: { concurrency?: number },
): Promise<TelegramSendResult[]> {
  // v1: sequential dispatch (safe default). Add concurrency later if needed.
  void opts;
  const out: TelegramSendResult[] = [];
  for (const input of inputs) {
    out.push(await sendTelegramMessage(input));
  }
  return out;
}

