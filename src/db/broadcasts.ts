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
  /** Distinct non-null error codes from failed deliveries, comma-separated; null if none. */
  error_code_summary: string | null;
  recipients_total: number;
  success_count: number;
  failure_count: number;
  attachments_count: number;
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
        (
          select string_agg(sub.code, ', ' order by sub.code)
          from (
            select distinct dr.error_code::text as code
            from delivery_results dr
            where dr.broadcast_message_id = bm.id
              and dr.status = 'failure'
              and dr.error_code is not null
          ) sub
        ) as error_code_summary,
        (select count(*)::int from broadcast_recipients br where br.broadcast_message_id = bm.id) as recipients_total,
        (select count(*)::int from delivery_results dr where dr.broadcast_message_id = bm.id and dr.status = 'success') as success_count,
        (select count(*)::int from delivery_results dr where dr.broadcast_message_id = bm.id and dr.status = 'failure') as failure_count,
        (select count(*)::int from broadcast_attachments ba where ba.broadcast_message_id = bm.id) as attachments_count
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
  attachments_count: number;
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
    `
      select
        bm.id,
        bm.content,
        bm.format,
        bm.target_mode,
        bm.created_at,
        bm.sent_at,
        bm.status,
        (select count(*)::int from broadcast_attachments ba where ba.broadcast_message_id = bm.id) as attachments_count
      from broadcast_messages bm
      where bm.id = $1
    `,
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

export type BroadcastComposeAttachment = {
  ordinal: number;
  original_filename: string | null;
  mime_type: string;
  size_bytes: number;
};

export type BroadcastComposePayload = {
  source_broadcast_id: number;
  content: string;
  format: "html" | "plain";
  target_mode: "all" | "subset";
  chat_ids: number[];
  attachments: BroadcastComposeAttachment[];
  skipped_recipients: number;
};

export type DraftSaveInput = {
  content: string;
  format: "html" | "plain";
  targetMode: "all" | "subset";
  chatIds: number[];
  attachmentMeta?: Array<{
    originalFilename?: string | null;
    mimeType: string;
    sizeBytes: number;
  }>;
  createdByAdminUserId?: number;
};

export async function listBroadcastRecipientChatIds(
  broadcastMessageId: number,
  pool: Pool = getPool(),
): Promise<number[]> {
  const res = await pool.query<{ chat_id: number }>(
    `
      select chat_id
      from broadcast_recipients
      where broadcast_message_id = $1
      order by chat_id asc
    `,
    [broadcastMessageId],
  );
  return res.rows.map((r) => Number(r.chat_id));
}

export async function getBroadcastComposePayload(
  id: number,
  options: { failedOnly?: boolean },
  pool: Pool = getPool(),
): Promise<BroadcastComposePayload | null> {
  const { broadcast } = await getBroadcastDetails(id, pool);
  if (!broadcast) return null;

  const attachmentsRes = await pool.query<BroadcastComposeAttachment>(
    `
      select ordinal, original_filename, mime_type, size_bytes::int as size_bytes
      from broadcast_attachments
      where broadcast_message_id = $1
      order by ordinal asc
    `,
    [id],
  );

  const format = broadcast.format === "plain" ? "plain" : "html";

  if (options.failedOnly) {
    const failedRes = await pool.query<{ chat_id: number }>(
      `
        select dr.chat_id
        from delivery_results dr
        join chats c on c.id = dr.chat_id
        where dr.broadcast_message_id = $1 and dr.status = 'failure'
        order by dr.chat_id asc
      `,
      [id],
    );

    if (failedRes.rows.length === 0) {
      throw new Error("NO_FAILURES");
    }

    const allFailedRes = await pool.query<{ chat_id: number }>(
      `
        select chat_id
        from delivery_results
        where broadcast_message_id = $1 and status = 'failure'
      `,
      [id],
    );
    const skipped = allFailedRes.rows.length - failedRes.rows.length;

    return {
      source_broadcast_id: id,
      content: broadcast.content,
      format,
      target_mode: "subset",
      chat_ids: failedRes.rows.map((r) => Number(r.chat_id)),
      attachments: attachmentsRes.rows.map((a) => ({
        ...a,
        size_bytes: Number(a.size_bytes),
      })),
      skipped_recipients: skipped,
    };
  }

  let chatIds: number[] = [];
  if (broadcast.target_mode === "subset") {
    chatIds = await listBroadcastRecipientChatIds(id, pool);
    const existing = await pool.query<{ id: number }>(
      `select id from chats where id = any($1::bigint[])`,
      [chatIds],
    );
    const existingSet = new Set(existing.rows.map((r) => Number(r.id)));
    const skipped = chatIds.filter((cid) => !existingSet.has(Number(cid))).length;
    chatIds = chatIds.filter((cid) => existingSet.has(Number(cid)));

    return {
      source_broadcast_id: id,
      content: broadcast.content,
      format,
      target_mode: "subset",
      chat_ids: chatIds,
      attachments: attachmentsRes.rows.map((a) => ({
        ...a,
        size_bytes: Number(a.size_bytes),
      })),
      skipped_recipients: skipped,
    };
  }

  return {
    source_broadcast_id: id,
    content: broadcast.content,
    format,
    target_mode: "all",
    chat_ids: [],
    attachments: attachmentsRes.rows.map((a) => ({
      ...a,
      size_bytes: Number(a.size_bytes),
    })),
    skipped_recipients: 0,
  };
}

export async function replaceBroadcastRecipients(
  broadcastMessageId: number,
  chatIds: number[],
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(`delete from broadcast_recipients where broadcast_message_id = $1`, [
    broadcastMessageId,
  ]);
  if (chatIds.length > 0) {
    await addBroadcastRecipients(broadcastMessageId, chatIds, pool);
  }
}

export async function replaceBroadcastAttachmentMeta(
  broadcastMessageId: number,
  rows: Array<{
    originalFilename?: string | null;
    mimeType: string;
    sizeBytes: number;
  }>,
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(`delete from broadcast_attachments where broadcast_message_id = $1`, [
    broadcastMessageId,
  ]);
  if (rows.length === 0) return;

  for (let ordinal = 0; ordinal < rows.length; ordinal += 1) {
    const r = rows[ordinal]!;
    await pool.query(
      `
        insert into broadcast_attachments (
          broadcast_message_id, ordinal, original_filename, mime_type, size_bytes, telegram_file_id
        )
        values ($1, $2, $3, $4, $5, null)
      `,
      [broadcastMessageId, ordinal, r.originalFilename ?? null, r.mimeType, r.sizeBytes],
    );
  }
}

async function persistDraftPayload(
  broadcastMessageId: number,
  input: DraftSaveInput,
  pool: Pool,
): Promise<void> {
  await pool.query(
    `
      update broadcast_messages
      set content = $2, format = $3, target_mode = $4
      where id = $1
    `,
    [broadcastMessageId, input.content, input.format, input.targetMode],
  );

  if (input.targetMode === "subset") {
    await replaceBroadcastRecipients(broadcastMessageId, input.chatIds, pool);
  } else {
    await replaceBroadcastRecipients(broadcastMessageId, [], pool);
  }

  await replaceBroadcastAttachmentMeta(broadcastMessageId, input.attachmentMeta ?? [], pool);
}

export async function createDraft(
  input: DraftSaveInput,
  pool: Pool = getPool(),
): Promise<{ id: number }> {
  const { id } = await createBroadcastMessage(
    {
      content: input.content,
      format: input.format,
      targetMode: input.targetMode,
      createdByAdminUserId: input.createdByAdminUserId,
    },
    pool,
  );
  await persistDraftPayload(id, input, pool);
  return { id };
}

export async function updateDraft(
  id: number,
  input: DraftSaveInput,
  pool: Pool = getPool(),
): Promise<void> {
  const row = await pool.query<{ status: string }>(
    `select status from broadcast_messages where id = $1`,
    [id],
  );
  if (row.rows.length === 0) {
    throw new Error("NOT_FOUND");
  }
  if (row.rows[0]!.status !== "draft") {
    throw new Error("NOT_DRAFT");
  }
  await persistDraftPayload(id, input, pool);
}

export async function deleteDraft(id: number, pool: Pool = getPool()): Promise<void> {
  const row = await pool.query<{ status: string }>(
    `select status from broadcast_messages where id = $1`,
    [id],
  );
  if (row.rows.length === 0) {
    throw new Error("NOT_FOUND");
  }
  if (row.rows[0]!.status !== "draft") {
    throw new Error("NOT_DRAFT");
  }
  await pool.query(`delete from broadcast_messages where id = $1`, [id]);
}

export async function getBroadcastStatus(
  id: number,
  pool: Pool = getPool(),
): Promise<string | null> {
  const res = await pool.query<{ status: string }>(
    `select status from broadcast_messages where id = $1`,
    [id],
  );
  return res.rows[0]?.status ?? null;
}

export async function updateBroadcastMessageFields(
  id: number,
  patch: { content: string; format: "html" | "plain"; targetMode: "all" | "subset" },
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      update broadcast_messages
      set content = $2, format = $3, target_mode = $4
      where id = $1
    `,
    [id, patch.content, patch.format, patch.targetMode],
  );
}

