import type { Pool } from "pg";

import { getPool } from "./pool";

export async function upsertDeliveryResult(
  input: {
    broadcastMessageId: number;
    chatId: number;
    status: "success" | "failure";
    attemptCount: number;
    sentAt?: Date | null;
    telegramMessageId?: number | null;
    errorCode?: string | null;
    errorMessage?: string | null;
  },
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      insert into delivery_results (
        broadcast_message_id,
        chat_id,
        status,
        attempt_count,
        sent_at,
        telegram_message_id,
        error_code,
        error_message
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      on conflict (broadcast_message_id, chat_id) do update set
        status = excluded.status,
        attempt_count = excluded.attempt_count,
        sent_at = excluded.sent_at,
        telegram_message_id = excluded.telegram_message_id,
        error_code = excluded.error_code,
        error_message = excluded.error_message
    `,
    [
      input.broadcastMessageId,
      input.chatId,
      input.status,
      input.attemptCount,
      input.sentAt ?? null,
      input.telegramMessageId ?? null,
      input.errorCode ?? null,
      input.errorMessage ?? null,
    ],
  );
}

