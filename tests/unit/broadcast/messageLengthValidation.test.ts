import { describe, expect, it } from "vitest";

import { validateBroadcastImages } from "@/src/domain/broadcast/validateImages";

describe("validateBroadcastImages - message length", () => {
  it("accepts exactly 1024 characters", () => {
    const content = "a".repeat(1024);
    const res = validateBroadcastImages({ content, images: [{ mimeType: "image/png" }] });
    expect(res.ok).toBe(true);
  });

  it("rejects 1025 characters", () => {
    const content = "a".repeat(1025);
    const res = validateBroadcastImages({ content, images: [{ mimeType: "image/png" }] });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.message).toContain("1024");
    }
  });
});

