import "dotenv/config";

import bcrypt from "bcryptjs";

import { getSeedEnv } from "./env";
import { getPool } from "./pool";

async function main() {
  const seedEnv = getSeedEnv();
  const login = seedEnv.ADMIN_LOGIN ?? "admin";
  const password = seedEnv.ADMIN_PASSWORD ?? "change-me";

  const passwordHash = await bcrypt.hash(password, 12);

  const pool = getPool();
  await pool.query(
    `
      insert into admin_users (login, password_hash)
      values ($1, $2)
      on conflict (login) do update set
        password_hash = excluded.password_hash,
        updated_at = now()
    `,
    [login, passwordHash],
  );

  console.log(`Seeded admin user: ${login}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

