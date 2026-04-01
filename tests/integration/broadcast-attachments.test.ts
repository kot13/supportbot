import { describe, expect, it } from "vitest";

import { getPool } from "@/src/db/pool";
import { createBroadcastMessage, listBroadcasts } from "@/src/db/broadcasts";
import { insertBroadcastAttachments } from "@/src/db/broadcastAttachments";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("broadcast attachments persistence", () => {
  it("persists attachments and exposes attachments_count in history list", async () => {
    const pool = getPool();

    const { id: broadcastId } = await createBroadcastMessage({
      content: "hello",
      format: "html",
      targetMode: "all",
    });

    await insertBroadcastAttachments(
      [
        {
          broadcastMessageId: broadcastId,
          ordinal: 0,
          originalFilename: "a.png",
          mimeType: "image/png",
          sizeBytes: 123,
          telegramFileId: null,
        },
        {
          broadcastMessageId: broadcastId,
          ordinal: 1,
          originalFilename: "b.png",
          mimeType: "image/png",
          sizeBytes: 456,
          telegramFileId: null,
        },
      ],
      pool,
    );

    const rows = await listBroadcasts(pool);
    const row = rows.find((r) => r.id === broadcastId);
    expect(row).toBeTruthy();
    expect(row?.attachments_count).toBe(2);
  });
});

