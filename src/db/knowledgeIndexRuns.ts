import type { Pool } from "pg";

import type { EmbeddingModel } from "@/src/domain/botSettings/models";

import { getPool } from "./pool";

export type IndexRunStatus = "running" | "completed" | "failed";

export type IndexRunRow = {
  id: number;
  status: IndexRunStatus;
  chunk_count: number | null;
  error_message: string | null;
  embedding_model: string | null;
  started_at: Date;
  finished_at: Date | null;
};

export async function startIndexRun(pool: Pool = getPool()): Promise<number> {
  const res = await pool.query<{ id: number }>(
    `insert into knowledge_index_runs (status) values ('running') returning id`,
  );
  return res.rows[0]!.id;
}

export async function completeIndexRun(
  runId: number,
  chunkCount: number,
  embeddingModel: EmbeddingModel,
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      update knowledge_index_runs
      set status = 'completed',
          chunk_count = $2,
          embedding_model = $3,
          finished_at = now()
      where id = $1
    `,
    [runId, chunkCount, embeddingModel],
  );
}

export async function failIndexRun(
  runId: number,
  errorMessage: string,
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      update knowledge_index_runs
      set status = 'failed', error_message = $2, finished_at = now()
      where id = $1
    `,
    [runId, errorMessage.slice(0, 2000)],
  );
}

export async function hasRunningIndexRun(pool: Pool = getPool()): Promise<boolean> {
  const res = await pool.query<{ c: string }>(
    `select count(*)::text as c from knowledge_index_runs where status = 'running'`,
  );
  return Number(res.rows[0]?.c ?? 0) > 0;
}

export async function getRunningIndexRun(pool: Pool = getPool()): Promise<IndexRunRow | null> {
  const res = await pool.query<IndexRunRow>(
    `
      select id, status, chunk_count, error_message, embedding_model, started_at, finished_at
      from knowledge_index_runs
      where status = 'running'
      order by started_at desc
      limit 1
    `,
  );
  return res.rows[0] ?? null;
}

export async function getLatestCompletedIndexRun(
  pool: Pool = getPool(),
): Promise<IndexRunRow | null> {
  const res = await pool.query<IndexRunRow>(
    `
      select id, status, chunk_count, error_message, embedding_model, started_at, finished_at
      from knowledge_index_runs
      where status = 'completed'
      order by finished_at desc nulls last, id desc
      limit 1
    `,
  );
  return res.rows[0] ?? null;
}

export async function getLatestIndexRun(pool: Pool = getPool()): Promise<IndexRunRow | null> {
  const res = await pool.query<IndexRunRow>(
    `
      select id, status, chunk_count, error_message, embedding_model, started_at, finished_at
      from knowledge_index_runs
      order by coalesce(finished_at, started_at) desc, id desc
      limit 1
    `,
  );
  return res.rows[0] ?? null;
}
