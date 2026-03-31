import crypto from "node:crypto";

import { cookies } from "next/headers";

import { getPool } from "@/src/db/pool";

const COOKIE_NAME = "sb_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type Session = {
  id: string;
  adminUserId: number;
  expiresAt: Date;
};

export async function createSession(adminUserId: number): Promise<Session> {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const pool = getPool();
  await pool.query(
    "insert into sessions (id, admin_user_id, expires_at) values ($1, $2, $3)",
    [id, adminUserId, expiresAt],
  );

  const jar = await cookies();
  jar.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return { id, adminUserId, expiresAt };
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (!id) return null;

  const pool = getPool();
  const res = await pool.query<{
    id: string;
    admin_user_id: number;
    expires_at: Date;
  }>("select id, admin_user_id, expires_at from sessions where id = $1", [id]);

  const row = res.rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;

  return {
    id: row.id,
    adminUserId: row.admin_user_id,
    expiresAt: new Date(row.expires_at),
  };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (id) {
    const pool = getPool();
    await pool.query("delete from sessions where id = $1", [id]);
  }
  jar.delete(COOKIE_NAME);
}

