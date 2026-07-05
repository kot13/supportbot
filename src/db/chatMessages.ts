import type { Pool } from "pg";

import { getPool } from "./pool";
import {
  insertUnansweredContextSnapshot,
  type UnansweredContextSnapshot,
} from "./unansweredContextSnapshots";

export type ChatMessageRole = "user" | "bot";

export type ChatMessageRow = {
  id: number;
  chat_id: number;
  role: ChatMessageRole;
  content: string;
  telegram_message_id: number | null;
  telegram_user_id: number | null;
  telegram_username: string | null;
  telegram_user_first_name: string | null;
  unanswered_reason: string | null;
  created_at: Date;
};

export type UnansweredMessageRow = {
  id: number;
  chat_id: number;
  content: string;
  unanswered_reason: string;
  created_at: Date;
  chat_title: string | null;
  chat_type: string | null;
  telegram_chat_id: string;
  telegram_username: string | null;
  telegram_user_first_name: string | null;
  telegram_user_id: number | null;
};

export async function insertChatMessage(
  input: {
    chatId: number;
    role: ChatMessageRole;
    content: string;
    telegramMessageId?: number | null;
    telegramUserId?: number | null;
    telegramUsername?: string | null;
    telegramUserFirstName?: string | null;
  },
  pool: Pool = getPool(),
): Promise<ChatMessageRow> {
  const res = await pool.query<ChatMessageRow>(
    `
      insert into chat_messages (
        chat_id, role, content, telegram_message_id, telegram_user_id,
        telegram_username, telegram_user_first_name
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (chat_id, telegram_message_id) where telegram_message_id is not null
      do update set
        content = excluded.content,
        telegram_user_id = excluded.telegram_user_id,
        telegram_username = excluded.telegram_username,
        telegram_user_first_name = excluded.telegram_user_first_name
      returning id, chat_id, role, content, telegram_message_id, telegram_user_id,
        telegram_username, telegram_user_first_name, unanswered_reason, created_at
    `,
    [
      input.chatId,
      input.role,
      input.content,
      input.telegramMessageId ?? null,
      input.telegramUserId ?? null,
      input.telegramUsername ?? null,
      input.telegramUserFirstName ?? null,
    ],
  );
  return res.rows[0]!;
}

export async function listChatMessages(
  chatId: number,
  opts: { limit?: number; before?: number; after?: number } = {},
  pool: Pool = getPool(),
): Promise<ChatMessageRow[]> {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
  const params: unknown[] = [chatId];
  let cursorSql = "";
  let orderSql = "order by id desc";

  if (opts.before !== undefined && opts.after !== undefined) {
    throw new Error("listChatMessages: use either before or after, not both");
  }

  if (opts.before !== undefined) {
    params.push(opts.before);
    cursorSql = `and id < $${params.length}`;
  } else if (opts.after !== undefined) {
    params.push(opts.after);
    cursorSql = `and id > $${params.length}`;
    orderSql = "order by id asc";
  }

  params.push(limit);

  const res = await pool.query<ChatMessageRow>(
    `
      select id, chat_id, role, content, telegram_message_id, telegram_user_id,
        telegram_username, telegram_user_first_name, unanswered_reason, created_at
      from chat_messages
      where chat_id = $1 ${cursorSql}
      ${orderSql}
      limit $${params.length}
    `,
    params,
  );

  return opts.after !== undefined ? res.rows : res.rows.reverse();
}

export async function listRecentChatMessages(
  chatId: number,
  limit: number,
  pool: Pool = getPool(),
): Promise<ChatMessageRow[]> {
  const res = await pool.query<ChatMessageRow>(
    `
      select id, chat_id, role, content, telegram_message_id, telegram_user_id,
        telegram_username, telegram_user_first_name, unanswered_reason, created_at
      from chat_messages
      where chat_id = $1
      order by id desc
      limit $2
    `,
    [chatId, limit],
  );
  return res.rows.reverse();
}

export async function markMessageUnanswered(
  messageId: number,
  reason: string,
  snapshot?: UnansweredContextSnapshot,
  pool: Pool = getPool(),
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const res = await client.query<{ id: number }>(
      `
        update chat_messages
        set unanswered_reason = $2
        where id = $1 and role = 'user' and unanswered_reason is null
        returning id
      `,
      [messageId, reason],
    );
    if (res.rowCount && snapshot) {
      await insertUnansweredContextSnapshot(messageId, snapshot, client);
    }
    await client.query("commit");
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
}

export async function getUnansweredUserMessageById(
  messageId: number,
  pool: Pool = getPool(),
): Promise<ChatMessageRow | null> {
  const res = await pool.query<ChatMessageRow>(
    `
      select id, chat_id, role, content, telegram_message_id, telegram_user_id,
        telegram_username, telegram_user_first_name, unanswered_reason, created_at
      from chat_messages
      where id = $1 and role = 'user' and unanswered_reason is not null
    `,
    [messageId],
  );
  return res.rows[0] ?? null;
}

export async function listUnansweredMessages(
  opts: { limit?: number } = {},
  pool: Pool = getPool(),
): Promise<UnansweredMessageRow[]> {
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 500);
  const res = await pool.query<UnansweredMessageRow>(
    `
      select
        m.id,
        m.chat_id,
        m.content,
        m.unanswered_reason,
        m.created_at,
        c.title as chat_title,
        c.type as chat_type,
        c.telegram_chat_id::text as telegram_chat_id,
        m.telegram_username,
        m.telegram_user_first_name,
        m.telegram_user_id
      from chat_messages m
      join chats c on c.id = m.chat_id
      where m.role = 'user' and m.unanswered_reason is not null
      order by m.created_at desc
      limit $1
    `,
    [limit],
  );
  return res.rows;
}
