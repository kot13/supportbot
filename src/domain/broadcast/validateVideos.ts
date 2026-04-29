export const BROADCAST_VIDEO_MAX_COUNT = 10;

/** Bot API typical limit — align with hosting upload limits separately */
export const BROADCAST_VIDEO_MAX_FILE_BYTES = 50 * 1024 * 1024;

const ALLOWED_VIDEO_MIMES = new Set(["video/mp4", "video/quicktime"]);

export const MSG_MIXED_MEDIA =
  "Cannot attach images and videos in the same broadcast. Clear one type to use the other.";

export const MSG_VIDEO_TYPE =
  "Only MP4 and MOV videos are allowed (video/mp4 or video/quicktime).";

export const MSG_VIDEO_COUNT = `Up to ${BROADCAST_VIDEO_MAX_COUNT} videos are allowed`;

export const MSG_VIDEO_SIZE = `Each video must be at most ${Math.floor(BROADCAST_VIDEO_MAX_FILE_BYTES / (1024 * 1024))} MB`;

const MAX_BROADCAST_CAPTION_WITH_MEDIA = 1024;

export type BroadcastVideoLike = { mimeType: string; sizeBytes: number };

export type BroadcastVideosValidationResult =
  | { ok: true }
  | { ok: false; code: "VALIDATION"; message: string };

export function normalizeVideoMimeType(file: { type: string; name: string }): string {
  if (file.type && ALLOWED_VIDEO_MIMES.has(file.type)) {
    return file.type;
  }
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".mov")) return "video/quicktime";
  return file.type || "";
}

export function isAllowedVideoMimeType(mimeType: string): boolean {
  return ALLOWED_VIDEO_MIMES.has(mimeType);
}

export function validateBroadcastVideos(input: {
  content: string;
  videos: BroadcastVideoLike[];
}): BroadcastVideosValidationResult {
  const videos = input.videos;

  if (videos.length === 0) return { ok: true };

  if (videos.length > BROADCAST_VIDEO_MAX_COUNT) {
    return { ok: false, code: "VALIDATION", message: MSG_VIDEO_COUNT };
  }

  for (const v of videos) {
    if (!isAllowedVideoMimeType(v.mimeType)) {
      return { ok: false, code: "VALIDATION", message: MSG_VIDEO_TYPE };
    }
    if (v.sizeBytes > BROADCAST_VIDEO_MAX_FILE_BYTES) {
      return { ok: false, code: "VALIDATION", message: MSG_VIDEO_SIZE };
    }
  }

  if (input.content.length > MAX_BROADCAST_CAPTION_WITH_MEDIA) {
    return {
      ok: false,
      code: "VALIDATION",
      message: `Message is too long for a caption with attachments (max ${MAX_BROADCAST_CAPTION_WITH_MEDIA} characters)`,
    };
  }

  return { ok: true };
}
