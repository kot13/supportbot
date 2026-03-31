import "dotenv/config";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { getPool } from "./pool";

const MIGRATIONS_DIR = path.join(process.cwd(), "src", "db", "migrations");

async function ensureMigrationsTable() {
  const pool = getPool();
  await pool.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);
}

async function getAppliedIds(): Promise<Set<string>> {
  const pool = getPool();
  const res = await pool.query<{ id: string }>("select id from schema_migrations");
  return new Set(res.rows.map((r) => r.id));
}

async function applyMigration(id: string, sql: string) {
  const pool = getPool();
  await pool.query("begin");
  try {
    await pool.query(sql);
    await pool.query("insert into schema_migrations (id) values ($1)", [id]);
    await pool.query("commit");
  } catch (e) {
    await pool.query("rollback");
    throw e;
  }
}

async function main() {
  await ensureMigrationsTable();
  const applied = await getAppliedIds();

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    if (applied.has(file)) continue;
    const fullPath = path.join(MIGRATIONS_DIR, file);
    const sql = await readFile(fullPath, "utf-8");
    console.log(`Applying migration: ${file}`);
    await applyMigration(file, sql);
  }

  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

