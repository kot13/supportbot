import { describe, expect, it } from "vitest";

import { validateBroadcastImages } from "@/src/domain/broadcast/validateImages";

describe("validateBroadcastImages", () => {
  it("allows no images", () => {
    expect(validateBroadcastImages({ content: "hello", images: [] })).toEqual({ ok: true });
  });

  it("rejects more than 10 images", () => {
    const images = Array.from({ length: 11 }, () => ({ mimeType: "image/png" }));
    expect(validateBroadcastImages({ content: "hello", images })).toEqual({
      ok: false,
      code: "VALIDATION",
      message: "Up to 10 images are allowed",
    });
  });

  it("rejects non-image files", () => {
    expect(validateBroadcastImages({ content: "hello", images: [{ mimeType: "application/pdf" }] })).toEqual({
      ok: false,
      code: "VALIDATION",
      message: "Only image files are allowed",
    });
  });

  it("rejects too-long caption when images present", () => {
    const long = "a".repeat(1025);
    expect(validateBroadcastImages({ content: long, images: [{ mimeType: "image/jpeg" }] })).toEqual({
      ok: false,
      code: "VALIDATION",
      message: "Message is too long for an image caption (max 1024 characters)",
    });
  });
});

