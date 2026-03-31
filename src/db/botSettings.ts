import type { Pool } from "pg";

import { getPool } from "./pool";

export type BotSettingsRow = {
  bot_name: string | null;
  bot_token_secret: string | null;
};

export async function getBotSettings(pool: Pool = getPool()): Promise<BotSettingsRow> {
  const res = await pool.query<BotSettingsRow>(
    "select bot_name, bot_token_secret from bot_settings where id = 1",
  );
  return res.rows[0] ?? { bot_name: null, bot_token_secret: null };
}

export async function upsertBotSettings(
  input: { botName: string | null; botTokenSecret: string | null },
  pool: Pool = getPool(),
) {
  await pool.query(
    `
      insert into bot_settings (id, bot_name, bot_token_secret)
      values (1, $1, $2)
      on conflict (id) do update set
        bot_name = excluded.bot_name,
        bot_token_secret = excluded.bot_token_secret,
        updated_at = now()
    `,
    [input.botName, input.botTokenSecret],
  );
}

