import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import { handleTelegramUpdate } from "@/src/telegram/handleUpdate";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("chat upsert from Telegram updates", () => {
  it("upserts chat from message update and does not duplicate on conflict", async () => {
    const pool = getPool();
    const chatId = -1009008007006;

    const update = {
      message: {
        message_id: 1,
        date: 1700000000,
        chat: { id: chatId, type: "supergroup", title: "Integration chat" },
      },
    };

    await handleTelegramUpdate(update);
    await handleTelegramUpdate({
      ...update,
      message: {
        ...update.message,
        chat: { ...update.message.chat, title: "Integration chat renamed" },
      },
    });

    const res = await pool.query<{ c: string }>(
      "select count(*)::text as c from chats where telegram_chat_id = $1",
      [String(chatId)],
    );
    expect(res.rows[0]?.c).toBe("1");

    const row = await pool.query<{ title: string | null; is_active: boolean }>(
      "select title, is_active from chats where telegram_chat_id = $1",
      [String(chatId)],
    );
    expect(row.rows[0]?.title).toBe("Integration chat renamed");
    expect(row.rows[0]?.is_active).toBe(true);
  });
});
