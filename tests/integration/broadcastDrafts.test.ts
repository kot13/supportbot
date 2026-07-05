import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import {
  createDraft,
  deleteDraft,
  getBroadcastStatus,
  listBroadcastRecipientChatIds,
  updateDraft,
} from "@/src/db/broadcasts";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("broadcast drafts", () => {
  it("creates and updates draft with recipients", async () => {
    const pool = getPool();

    const chatRes = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [Date.now() + 400, "Draft chat"],
    );
    const chatId = chatRes.rows[0]!.id;

    const { id } = await createDraft(
      {
        content: "draft v1",
        format: "html",
        targetMode: "subset",
        chatIds: [chatId],
      },
      pool,
    );

    expect(await getBroadcastStatus(id, pool)).toBe("draft");
    expect(await listBroadcastRecipientChatIds(id, pool)).toEqual([chatId]);

    await updateDraft(
      id,
      {
        content: "draft v2",
        format: "html",
        targetMode: "subset",
        chatIds: [chatId],
        attachmentMeta: [
          { originalFilename: "a.png", mimeType: "image/png", sizeBytes: 100 },
        ],
      },
      pool,
    );

    const contentRes = await pool.query<{ content: string }>(
      "select content from broadcast_messages where id = $1",
      [id],
    );
    expect(contentRes.rows[0]!.content).toBe("draft v2");

    const att = await pool.query("select id from broadcast_attachments where broadcast_message_id = $1", [
      id,
    ]);
    expect(att.rowCount).toBe(1);
  });

  it("deletes draft only", async () => {
    const pool = getPool();

    const { id } = await createDraft(
      {
        content: "to delete",
        format: "html",
        targetMode: "all",
        chatIds: [],
      },
      pool,
    );

    await deleteDraft(id, pool);
    expect(await getBroadcastStatus(id, pool)).toBeNull();
  });

  it("rejects delete on non-draft", async () => {
    const pool = getPool();
    const { id } = await createDraft(
      { content: "x", format: "html", targetMode: "all", chatIds: [] },
      pool,
    );
    await pool.query(`update broadcast_messages set status = 'completed' where id = $1`, [id]);
    await expect(deleteDraft(id, pool)).rejects.toThrow("NOT_DRAFT");
  });
});
