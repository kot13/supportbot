import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import {
  addBroadcastRecipients,
  createBroadcastMessage,
  getBroadcastComposePayload,
  updateBroadcastStatus,
} from "@/src/db/broadcasts";
import { upsertDeliveryResult } from "@/src/db/deliveryResults";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("broadcast compose", () => {
  it("returns prefill payload for subset broadcast", async () => {
    const pool = getPool();

    const chatRes = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [Date.now() + 100, "Compose chat"],
    );
    const chatId = chatRes.rows[0]!.id;

    const { id } = await createBroadcastMessage({
      content: "resend me",
      format: "html",
      targetMode: "subset",
    });
    await addBroadcastRecipients(id, [chatId]);
    await updateBroadcastStatus(id, { status: "completed", sentAt: new Date() });

    const payload = await getBroadcastComposePayload(id, { failedOnly: false }, pool);
    expect(payload).not.toBeNull();
    expect(payload!.content).toBe("resend me");
    expect(payload!.target_mode).toBe("subset");
    expect(payload!.chat_ids).toEqual([chatId]);
  });

  it("returns null for missing broadcast", async () => {
    const payload = await getBroadcastComposePayload(999999999, { failedOnly: false });
    expect(payload).toBeNull();
  });

  it("failedOnly returns only failed chat ids", async () => {
    const pool = getPool();

    const chatOk = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [Date.now() + 200, "OK chat"],
    );
    const chatFail = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [Date.now() + 201, "Fail chat"],
    );

    const { id } = await createBroadcastMessage({
      content: "partial",
      format: "html",
      targetMode: "subset",
    });

    await addBroadcastRecipients(id, [chatOk.rows[0]!.id, chatFail.rows[0]!.id]);
    await upsertDeliveryResult({
      broadcastMessageId: id,
      chatId: chatOk.rows[0]!.id,
      status: "success",
      attemptCount: 1,
      sentAt: new Date(),
    });
    await upsertDeliveryResult({
      broadcastMessageId: id,
      chatId: chatFail.rows[0]!.id,
      status: "failure",
      attemptCount: 1,
      errorCode: "E500",
      errorMessage: "fail",
      sentAt: new Date(),
    });

    const payload = await getBroadcastComposePayload(id, { failedOnly: true }, pool);
    expect(payload!.target_mode).toBe("subset");
    expect(payload!.chat_ids).toEqual([chatFail.rows[0]!.id]);
  });

  it("failedOnly throws when no failures", async () => {
    const pool = getPool();
    const chatRes = await pool.query<{ id: number }>(
      "insert into chats (telegram_chat_id, title) values ($1, $2) on conflict (telegram_chat_id) do update set updated_at = now() returning id",
      [Date.now() + 300, "Only ok"],
    );

    const { id } = await createBroadcastMessage({
      content: "all ok",
      format: "html",
      targetMode: "subset",
    });
    await addBroadcastRecipients(id, [chatRes.rows[0]!.id]);
    await upsertDeliveryResult({
      broadcastMessageId: id,
      chatId: chatRes.rows[0]!.id,
      status: "success",
      attemptCount: 1,
      sentAt: new Date(),
    });

    await expect(getBroadcastComposePayload(id, { failedOnly: true }, pool)).rejects.toThrow(
      "NO_FAILURES",
    );
  });
});
