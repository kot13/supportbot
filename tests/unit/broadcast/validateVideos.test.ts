import { describe, expect, it } from "vitest";

import {
  BROADCAST_VIDEO_MAX_COUNT,
  BROADCAST_VIDEO_MAX_FILE_BYTES,
  validateBroadcastVideos,
} from "@/src/domain/broadcast/validateVideos";

describe("validateBroadcastVideos", () => {
  it("allows empty list", () => {
    expect(validateBroadcastVideos({ content: "hi", videos: [] })).toEqual({ ok: true });
  });

  it("allows one valid mp4 within limits", () => {
    expect(
      validateBroadcastVideos({
        content: "caption",
        videos: [{ mimeType: "video/mp4", sizeBytes: 100 }],
      }),
    ).toEqual({ ok: true });
  });

  it("rejects too many videos", () => {
    const videos = Array.from({ length: BROADCAST_VIDEO_MAX_COUNT + 1 }, () => ({
      mimeType: "video/mp4",
      sizeBytes: 1,
    }));
    const r = validateBroadcastVideos({ content: "x", videos });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("10");
  });

  it("rejects oversize file", () => {
    const r = validateBroadcastVideos({
      content: "x",
      videos: [{ mimeType: "video/mp4", sizeBytes: BROADCAST_VIDEO_MAX_FILE_BYTES + 1 }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("MB");
  });

  it("rejects wrong mime", () => {
    const r = validateBroadcastVideos({
      content: "x",
      videos: [{ mimeType: "video/webm", sizeBytes: 100 }],
    });
    expect(r.ok).toBe(false);
  });

  it("rejects caption over 1024 with videos", () => {
    const content = "a".repeat(1025);
    const r = validateBroadcastVideos({
      content,
      videos: [{ mimeType: "video/mp4", sizeBytes: 100 }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("1024");
  });
});
