import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import {
  createBroadcastMessage,
  addBroadcastRecipients,
  listBroadcasts,
} from "@/src/db/broadcasts";
import { upsertDeliveryResult } from "@/src/db/deliveryResults";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("broadcast persistence", () => {
  it("persists broadcast + recipients + delivery results", async () => {
    const pool = getPool();

    // Ensure there is at least one chat row
    const chatRes = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [Date.now(), "Test chat"],
    );
    const chatId = chatRes.rows[0]!.id;

    const { id: broadcastId } = await createBroadcastMessage({
      content: "hello",
      format: "html",
      targetMode: "subset",
    });

    await addBroadcastRecipients(broadcastId, [chatId]);
    await upsertDeliveryResult({
      broadcastMessageId: broadcastId,
      chatId,
      status: "failure",
      attemptCount: 1,
      errorCode: "TEST",
      errorMessage: "fail",
      sentAt: new Date(),
    });

    const b = await pool.query("select id from broadcast_messages where id = $1", [broadcastId]);
    const r = await pool.query("select id from broadcast_recipients where broadcast_message_id = $1", [broadcastId]);
    const d = await pool.query("select id from delivery_results where broadcast_message_id = $1", [broadcastId]);

    expect(b.rowCount).toBe(1);
    expect(r.rowCount).toBe(1);
    expect(d.rowCount).toBe(1);
  });

  it("listBroadcasts aggregates error_code_summary from failed deliveries", async () => {
    const pool = getPool();

    const chatRes = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [`${Date.now()}-agg`, "Agg chat"],
    );
    const chatId = chatRes.rows[0]!.id;

    const { id: broadcastId } = await createBroadcastMessage({
      content: "agg test",
      format: "html",
      targetMode: "subset",
    });

    await addBroadcastRecipients(broadcastId, [chatId]);
    await upsertDeliveryResult({
      broadcastMessageId: broadcastId,
      chatId,
      status: "failure",
      attemptCount: 1,
      errorCode: "E403",
      errorMessage: "forbidden",
      sentAt: new Date(),
    });

    const rows = await listBroadcasts(pool);
    const row = rows.find((r) => r.id === broadcastId);
    expect(row?.error_code_summary).toBe("E403");
  });

  it("listBroadcasts leaves error_code_summary null when failure has no error code", async () => {
    const pool = getPool();

    const chatRes = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [`${Date.now()}-nocode`, "No code chat"],
    );
    const chatId = chatRes.rows[0]!.id;

    const { id: broadcastId } = await createBroadcastMessage({
      content: "no code",
      format: "html",
      targetMode: "subset",
    });

    await addBroadcastRecipients(broadcastId, [chatId]);
    await upsertDeliveryResult({
      broadcastMessageId: broadcastId,
      chatId,
      status: "failure",
      attemptCount: 1,
      errorCode: null,
      errorMessage: "oops",
      sentAt: new Date(),
    });

    const rows = await listBroadcasts(pool);
    const row = rows.find((r) => r.id === broadcastId);
    expect(row?.error_code_summary).toBeNull();
  });
});

