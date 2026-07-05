import type { Pool } from "pg";

import { getPool } from "./pool";

export async function tryMarkProcessed(
  updateId: number,
  pool: Pool = getPool(),
): Promise<boolean> {
  const res = await pool.query(
    `
      insert into processed_telegram_updates (update_id)
      values ($1)
      on conflict (update_id) do nothing
      returning update_id
    `,
    [updateId],
  );
  return (res.rowCount ?? 0) > 0;
}
