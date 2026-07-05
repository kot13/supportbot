import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import { upsertChat } from "@/src/db/chats";
import { insertChatMessage, markMessageUnanswered } from "@/src/db/chatMessages";
import {
  getUnansweredContextSnapshot,
  type UnansweredContextSnapshot,
} from "@/src/db/unansweredContextSnapshots";
import { buildUnansweredContextSnapshot } from "@/src/rag/unansweredSnapshot";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("unanswered context snapshots", () => {
  it("persists snapshot with markMessageUnanswered and is idempotent", async () => {
    const pool = getPool();
    const telegramChatId = String(-1009008008000);

    await upsertChat({ telegramChatId, title: "Snapshot test chat", type: "private" });
    const chatRes = await pool.query<{ id: number }>(
      "select id from chats where telegram_chat_id = $1::bigint",
      [telegramChatId],
    );
    const chatId = chatRes.rows[0]!.id;

    await pool.query("delete from chat_messages where chat_id = $1", [chatId]);

    const userMessage = await insertChatMessage({
      chatId,
      role: "user",
      content: "What is the weather?",
      telegramMessageId: 2001,
      telegramUserId: 99,
    });

    const snapshot: UnansweredContextSnapshot = buildUnansweredContextSnapshot({
      searchPerformed: true,
      chunks: [
        {
          id: 1,
          sourceType: "sdk_doc",
          sourcePath: "test.md",
          title: "Test",
          content: "chunk body",
          metadata: null,
          distance: 0.8,
        },
      ],
      recentMessages: [{ role: "user", content: "What is the weather?" }],
    });

    await markMessageUnanswered(userMessage.id, "no_context", snapshot);

    const row = await getUnansweredContextSnapshot(userMessage.id);
    expect(row).not.toBeNull();
    expect(row!.search_performed).toBe(true);
    expect(row!.chunk_count).toBe(1);
    expect(row!.best_distance).toBe(0.8);
    expect(row!.retrieved_chunks[0]?.content).toBe("chunk body");

    const snapshot2: UnansweredContextSnapshot = buildUnansweredContextSnapshot({
      searchPerformed: false,
      chunks: [],
      recentMessages: [],
    });
    await markMessageUnanswered(userMessage.id, "openai_error", snapshot2);

    const rowAgain = await getUnansweredContextSnapshot(userMessage.id);
    expect(rowAgain!.chunk_count).toBe(1);
    expect(rowAgain!.search_performed).toBe(true);

    const reasonRes = await pool.query<{ unanswered_reason: string }>(
      "select unanswered_reason from chat_messages where id = $1",
      [userMessage.id],
    );
    expect(reasonRes.rows[0]?.unanswered_reason).toBe("no_context");
  });
});
