import type { Pool, PoolClient } from "pg";

import { getPool } from "./pool";

export type UnansweredDialogMessage = {
  role: "user" | "bot";
  content: string;
};

export type UnansweredRetrievedChunkSnapshot = {
  chunkId: number;
  sourceType: "sdk_doc" | "console_article" | "api_spec";
  sourcePath: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  distance: number;
};

export type UnansweredContextSnapshot = {
  searchPerformed: boolean;
  chunkCount: number;
  bestDistance: number | null;
  recentMessages: UnansweredDialogMessage[];
  retrievedChunks: UnansweredRetrievedChunkSnapshot[];
};

export type UnansweredContextSnapshotRow = {
  chat_message_id: number;
  search_performed: boolean;
  chunk_count: number;
  best_distance: number | null;
  recent_messages: UnansweredDialogMessage[];
  retrieved_chunks: UnansweredRetrievedChunkSnapshot[];
  created_at: Date;
};

type DbExecutor = Pool | PoolClient;

export async function insertUnansweredContextSnapshot(
  chatMessageId: number,
  snapshot: UnansweredContextSnapshot,
  executor: DbExecutor = getPool(),
): Promise<void> {
  await executor.query(
    `
      insert into unanswered_context_snapshots (
        chat_message_id,
        search_performed,
        chunk_count,
        best_distance,
        recent_messages,
        retrieved_chunks
      )
      values ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
      on conflict (chat_message_id) do nothing
    `,
    [
      chatMessageId,
      snapshot.searchPerformed,
      snapshot.chunkCount,
      snapshot.bestDistance,
      JSON.stringify(snapshot.recentMessages),
      JSON.stringify(snapshot.retrievedChunks),
    ],
  );
}

export async function getUnansweredContextSnapshot(
  chatMessageId: number,
  pool: Pool = getPool(),
): Promise<UnansweredContextSnapshotRow | null> {
  const res = await pool.query<UnansweredContextSnapshotRow>(
    `
      select
        chat_message_id,
        search_performed,
        chunk_count,
        best_distance,
        recent_messages,
        retrieved_chunks,
        created_at
      from unanswered_context_snapshots
      where chat_message_id = $1
    `,
    [chatMessageId],
  );
  return res.rows[0] ?? null;
}

export function rowToSnapshot(row: UnansweredContextSnapshotRow): UnansweredContextSnapshot {
  return {
    searchPerformed: row.search_performed,
    chunkCount: row.chunk_count,
    bestDistance: row.best_distance,
    recentMessages: row.recent_messages,
    retrievedChunks: row.retrieved_chunks,
  };
}
