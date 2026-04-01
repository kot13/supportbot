import type { Pool } from "pg";

import { getPool } from "./pool";

function isMissingRelationError(err: unknown): boolean {
  return Boolean(err && typeof err === "object" && (err as { code?: string }).code === "42P01");
}

export type BroadcastAttachmentInsert = {
  broadcastMessageId: number;
  ordinal: number;
  originalFilename: string | null;
  mimeType: string;
  sizeBytes: number;
  telegramFileId?: string | null;
};

export type BroadcastAttachmentRow = {
  id: number;
  broadcast_message_id: number;
  ordinal: number;
  original_filename: string | null;
  mime_type: string;
  size_bytes: string; // pg bigint
  telegram_file_id: string | null;
  created_at: Date;
};

export async function insertBroadcastAttachments(
  rows: BroadcastAttachmentInsert[],
  pool: Pool = getPool(),
): Promise<void> {
  try {
    for (const r of rows) {
      await pool.query(
        `
          insert into broadcast_attachments (
            broadcast_message_id,
            ordinal,
            original_filename,
            mime_type,
            size_bytes,
            telegram_file_id
          )
          values ($1, $2, $3, $4, $5, $6)
          on conflict (broadcast_message_id, ordinal) do nothing
        `,
        [
          r.broadcastMessageId,
          r.ordinal,
          r.originalFilename,
          r.mimeType,
          r.sizeBytes,
          r.telegramFileId ?? null,
        ],
      );
    }
  } catch (err) {
    if (isMissingRelationError(err)) {
      throw new Error(
        "Database schema is outdated: missing broadcast_attachments table. Run migrations (npm run db:migrate).",
      );
    }
    throw err;
  }
}

export async function listBroadcastAttachments(
  broadcastMessageId: number,
  pool: Pool = getPool(),
): Promise<BroadcastAttachmentRow[]> {
  try {
    const res = await pool.query<BroadcastAttachmentRow>(
      `
        select
          id,
          broadcast_message_id,
          ordinal,
          original_filename,
          mime_type,
          size_bytes,
          telegram_file_id,
          created_at
        from broadcast_attachments
        where broadcast_message_id = $1
        order by ordinal asc
      `,
      [broadcastMessageId],
    );

    return res.rows;
  } catch (err) {
    if (isMissingRelationError(err)) return [];
    throw err;
  }
}

export async function countBroadcastAttachments(
  broadcastMessageId: number,
  pool: Pool = getPool(),
): Promise<number> {
  try {
    const res = await pool.query<{ count: string }>(
      "select count(*)::text as count from broadcast_attachments where broadcast_message_id = $1",
      [broadcastMessageId],
    );
    return Number(res.rows[0]?.count ?? "0");
  } catch (err) {
    if (isMissingRelationError(err)) return 0;
    throw err;
  }
}

