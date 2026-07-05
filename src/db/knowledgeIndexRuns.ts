import type { Pool } from "pg";

import { getPool } from "./pool";

export type IndexRunStatus = "running" | "completed" | "failed";

export type IndexRunRow = {
  id: number;
  status: IndexRunStatus;
  chunk_count: number | null;
  error_message: string | null;
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
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      update knowledge_index_runs
      set status = 'completed', chunk_count = $2, finished_at = now()
      where id = $1
    `,
    [runId, chunkCount],
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
