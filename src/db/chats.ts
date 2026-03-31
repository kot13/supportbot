import type { Pool } from "pg";

import { getPool } from "./pool";

export type ChatRow = {
  id: number;
  telegram_chat_id: string;
  title: string | null;
  type: string | null;
  is_active: boolean;
  last_seen_at: Date | null;
};

export async function listChats(pool: Pool = getPool()): Promise<ChatRow[]> {
  const res = await pool.query<ChatRow>(
    "select id, telegram_chat_id::text as telegram_chat_id, title, type, is_active, last_seen_at from chats order by id desc",
  );
  return res.rows;
}

export async function upsertChat(
  input: {
    telegramChatId: string;
    title?: string;
    type?: string;
    isActive?: boolean;
    lastSeenAt?: Date;
  },
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      insert into chats (telegram_chat_id, title, type, is_active, last_seen_at)
      values ($1::bigint, $2, $3, $4, $5)
      on conflict (telegram_chat_id) do update set
        title = excluded.title,
        type = excluded.type,
        is_active = excluded.is_active,
        last_seen_at = excluded.last_seen_at,
        updated_at = now()
    `,
    [
      input.telegramChatId,
      input.title ?? null,
      input.type ?? null,
      input.isActive ?? true,
      input.lastSeenAt ?? new Date(),
    ],
  );
}

