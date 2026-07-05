import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import { upsertChat } from "@/src/db/chats";
import { insertChatMessage, listChatMessages } from "@/src/db/chatMessages";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("chat_messages persistence", () => {
  it("inserts and lists messages with pagination", async () => {
    const pool = getPool();
    const telegramChatId = String(-1009008007999);

    await upsertChat({ telegramChatId, title: "Msg test chat", type: "private" });
    const chatRes = await pool.query<{ id: number }>(
      "select id from chats where telegram_chat_id = $1::bigint",
      [telegramChatId],
    );
    const chatId = chatRes.rows[0]!.id;

    await pool.query("delete from chat_messages where chat_id = $1", [chatId]);

    await insertChatMessage({
      chatId,
      role: "user",
      content: "Question one",
      telegramMessageId: 1001,
      telegramUserId: 42,
    });
    await insertChatMessage({
      chatId,
      role: "bot",
      content: "Answer one",
      telegramMessageId: 1002,
    });

    const page = await listChatMessages(chatId, { limit: 10 });
    expect(page).toHaveLength(2);
    expect(page[0]?.role).toBe("user");
    expect(page[1]?.role).toBe("bot");

    const limited = await listChatMessages(chatId, { limit: 1 });
    expect(limited).toHaveLength(1);
    expect(limited[0]?.role).toBe("bot");
  });
});
