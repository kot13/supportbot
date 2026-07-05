import { describe, expect, it } from "vitest";

import { getBotSettings, upsertBotSettings } from "@/src/db/botSettings";
import { getPool } from "@/src/db/pool";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("bot settings models", () => {
  it("persists answer and embedding models", async () => {
    const pool = getPool();

    await upsertBotSettings(
      {
        botName: "test-bot",
        botTokenSecret: "token-for-models-test",
        answerModel: "gpt-5.5",
        embeddingModel: "text-embedding-3-large",
      },
      pool,
    );

    const settings = await getBotSettings(pool);
    expect(settings.answer_model).toBe("gpt-5.5");
    expect(settings.embedding_model).toBe("text-embedding-3-large");

    await upsertBotSettings(
      {
        botName: "test-bot",
        botTokenSecret: "token-for-models-test",
        answerModel: "gpt-4.1",
        embeddingModel: "text-embedding-3-small",
      },
      pool,
    );
  });
});
