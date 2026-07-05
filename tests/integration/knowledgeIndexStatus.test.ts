import { describe, expect, it } from "vitest";

import { upsertBotSettings } from "@/src/db/botSettings";
import {
  completeIndexRun,
  getLatestCompletedIndexRun,
  startIndexRun,
} from "@/src/db/knowledgeIndexRuns";
import { getPool } from "@/src/db/pool";
import { getKnowledgeIndexStatus } from "@/src/rag/knowledgeIndexStatus";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("knowledge index status", () => {
  it("records embedding model on completed run", async () => {
    const pool = getPool();
    const runId = await startIndexRun(pool);
    await completeIndexRun(runId, 42, "text-embedding-3-large", pool);

    const run = await getLatestCompletedIndexRun(pool);
    expect(run?.embedding_model).toBe("text-embedding-3-large");
  });

  it("reports outdated when settings embedding model differs from index", async () => {
    const pool = getPool();

    await upsertBotSettings(
      {
        botName: "status-bot",
        botTokenSecret: "token-status-test",
        embeddingModel: "text-embedding-3-large",
      },
      pool,
    );

    const runId = await startIndexRun(pool);
    await completeIndexRun(runId, 10, "text-embedding-3-small", pool);

    await pool.query("insert into knowledge_chunks (source_type, source_path, content, content_hash, embedding) values ('sdk_doc', 'test.md', 'hello', 'hash1', (select array_fill(0::float, array[1536])::vector)) on conflict do nothing");

    const status = await getKnowledgeIndexStatus();
    expect(status.state).toBe("outdated");
    expect(status.currentEmbeddingModel).toBe("text-embedding-3-large");
    expect(status.indexedEmbeddingModel).toBe("text-embedding-3-small");

    await upsertBotSettings(
      {
        botName: "status-bot",
        botTokenSecret: "token-status-test",
        embeddingModel: "text-embedding-3-small",
      },
      pool,
    );
  });
});
