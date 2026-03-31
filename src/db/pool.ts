import { Pool } from "pg";

import { requireDatabaseUrl } from "./env";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: requireDatabaseUrl(),
    });
  }
  return pool;
}

