import type { Pool } from "pg";

import type { AnswerModel, EmbeddingModel } from "@/src/domain/botSettings/models";
import {
  DEFAULT_ANSWER_MODEL,
  DEFAULT_EMBEDDING_MODEL,
} from "@/src/domain/botSettings/models";

import { getPool } from "./pool";

export type BotSettingsRow = {
  bot_name: string | null;
  bot_token_secret: string | null;
  answer_model: AnswerModel;
  embedding_model: EmbeddingModel;
};

export async function getBotSettings(pool: Pool = getPool()): Promise<BotSettingsRow> {
  const res = await pool.query<BotSettingsRow>(
  `select bot_name, bot_token_secret, answer_model, embedding_model
     from bot_settings where id = 1`,
  );
  return (
    res.rows[0] ?? {
      bot_name: null,
      bot_token_secret: null,
      answer_model: DEFAULT_ANSWER_MODEL,
      embedding_model: DEFAULT_EMBEDDING_MODEL,
    }
  );
}

export async function upsertBotSettings(
  input: {
    botName: string | null;
    botTokenSecret: string | null;
    answerModel?: AnswerModel;
    embeddingModel?: EmbeddingModel;
  },
  pool: Pool = getPool(),
) {
  const current = await getBotSettings(pool);
  const answerModel = input.answerModel ?? current.answer_model;
  const embeddingModel = input.embeddingModel ?? current.embedding_model;

  await pool.query(
    `
      insert into bot_settings (id, bot_name, bot_token_secret, answer_model, embedding_model)
      values (1, $1, $2, $3, $4)
      on conflict (id) do update set
        bot_name = excluded.bot_name,
        bot_token_secret = excluded.bot_token_secret,
        answer_model = excluded.answer_model,
        embedding_model = excluded.embedding_model,
        updated_at = now()
    `,
    [input.botName, input.botTokenSecret, answerModel, embeddingModel],
  );
}
