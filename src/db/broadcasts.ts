import type { Pool } from "pg";

import { getPool } from "./pool";

export type BroadcastMessageRow = {
  id: number;
  content: string;
  format: string;
  target_mode: string;
  created_at: Date;
  sent_at: Date | null;
  status: string;
};

export type BroadcastListRow = {
  id: number;
  created_at: Date;
  sent_at: Date | null;
  status: string;
  content_preview: string;
  recipients_total: number;
  success_count: number;
  failure_count: number;
};

export async function createBroadcastMessage(
  input: {
    content: string;
    format: "html" | "plain";
    targetMode: "all" | "subset";
    createdByAdminUserId?: number;
  },
  pool: Pool = getPool(),
): Promise<{ id: number }> {
  const res = await pool.query<{ id: number }>(
    `
      insert into broadcast_messages (content, format, target_mode, created_by_admin_user_id, status)
      values ($1, $2, $3, $4, 'draft')
      returning id
    `,
    [input.content, input.format, input.targetMode, input.createdByAdminUserId ?? null],
  );
  return { id: res.rows[0]!.id };
}

export async function updateBroadcastStatus(
  id: number,
  patch: { status?: string; sentAt?: Date | null },
  pool: Pool = getPool(),
): Promise<void> {
  const status = patch.status ?? null;
  const sentAt = patch.sentAt ?? null;

  await pool.query(
    `
      update broadcast_messages
      set
        status = coalesce($2, status),
        sent_at = coalesce($3, sent_at)
      where id = $1
    `,
    [id, status, sentAt],
  );
}

export async function addBroadcastRecipients(
  broadcastMessageId: number,
  chatIds: number[],
  pool: Pool = getPool(),
): Promise<void> {
  for (const chatId of chatIds) {
    await pool.query(
      `
        insert into broadcast_recipients (broadcast_message_id, chat_id)
        values ($1, $2)
        on conflict (broadcast_message_id, chat_id) do nothing
      `,
      [broadcastMessageId, chatId],
    );
  }
}

export async function listBroadcasts(pool: Pool = getPool()): Promise<BroadcastListRow[]> {
  const res = await pool.query<BroadcastListRow>(
    `
      select
        bm.id,
        bm.created_at,
        bm.sent_at,
        bm.status,
        left(bm.content, 120) as content_preview,
        (select count(*)::int from broadcast_recipients br where br.broadcast_message_id = bm.id) as recipients_total,
        (select count(*)::int from delivery_results dr where dr.broadcast_message_id = bm.id and dr.status = 'success') as success_count,
        (select count(*)::int from delivery_results dr where dr.broadcast_message_id = bm.id and dr.status = 'failure') as failure_count
      from broadcast_messages bm
      order by bm.id desc
      limit 100
    `,
  );
  return res.rows;
}

export type BroadcastDetailsRow = {
  id: number;
  content: string;
  format: string;
  target_mode: string;
  created_at: Date;
  sent_at: Date | null;
  status: string;
};

export type BroadcastDeliveryRow = {
  chat_id: number;
  telegram_chat_id: string;
  title: string | null;
  status: string;
  attempt_count: number;
  sent_at: Date | null;
  error_code: string | null;
  error_message: string | null;
};

export async function getBroadcastDetails(
  id: number,
  pool: Pool = getPool(),
): Promise<{ broadcast: BroadcastDetailsRow | null; deliveries: BroadcastDeliveryRow[] }> {
  const b = await pool.query<BroadcastDetailsRow>(
    "select id, content, format, target_mode, created_at, sent_at, status from broadcast_messages where id = $1",
    [id],
  );

  const d = await pool.query<BroadcastDeliveryRow>(
    `
      select
        dr.chat_id,
        c.telegram_chat_id::text as telegram_chat_id,
        c.title,
        dr.status,
        dr.attempt_count,
        dr.sent_at,
        dr.error_code,
        dr.error_message
      from delivery_results dr
      join chats c on c.id = dr.chat_id
      where dr.broadcast_message_id = $1
      order by dr.chat_id asc
    `,
    [id],
  );

  return { broadcast: b.rows[0] ?? null, deliveries: d.rows };
}

