import type { Pool } from "pg";

import { getPool } from "./pool";

export type AdminUserRow = {
  id: number;
  login: string;
  password_hash: string;
  disabled_at: Date | null;
};

export async function findAdminUserByLogin(
  login: string,
  pool: Pool = getPool(),
): Promise<AdminUserRow | null> {
  const res = await pool.query<AdminUserRow>(
    "select id, login, password_hash, disabled_at from admin_users where login = $1",
    [login],
  );
  return res.rows[0] ?? null;
}

