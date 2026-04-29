import { describe, expect, it } from "vitest";

import { truncateBroadcastBody } from "@/src/ui/broadcastConfirmationPreview";

describe("truncateBroadcastBody", () => {
  it("returns full text when under limit", () => {
    const t = "short";
    expect(truncateBroadcastBody(t, 600)).toEqual({
      preview: "short",
      truncated: false,
      totalChars: 5,
    });
  });

  it("truncates and flags when over limit", () => {
    const t = "x".repeat(700);
    const r = truncateBroadcastBody(t, 600);
    expect(r.truncated).toBe(true);
    expect(r.preview.length).toBe(600);
    expect(r.totalChars).toBe(700);
  });
});
