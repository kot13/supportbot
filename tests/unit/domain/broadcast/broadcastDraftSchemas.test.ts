import { describe, expect, it } from "vitest";

import { draftSaveBodySchema } from "@/src/domain/broadcast/broadcastDraftSchemas";

describe("draftSaveBodySchema", () => {
  it("coerces string chatIds and sizeBytes from JSON/pg", () => {
    const parsed = draftSaveBodySchema.parse({
      content: "hello",
      format: "html",
      targetMode: "subset",
      chatIds: ["12", "34"],
      attachmentMeta: [{ mimeType: "image/png", sizeBytes: "999" }],
    });

    expect(parsed.chatIds).toEqual([12, 34]);
    expect(parsed.attachmentMeta?.[0]?.sizeBytes).toBe(999);
  });
});
