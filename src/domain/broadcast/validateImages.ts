export type BroadcastImageLike = { mimeType: string };

export type BroadcastImagesValidationResult =
  | { ok: true }
  | { ok: false; code: "VALIDATION"; message: string };

export function validateBroadcastImages(input: {
  content: string;
  images: BroadcastImageLike[];
}): BroadcastImagesValidationResult {
  const images = input.images;

  if (images.length === 0) return { ok: true };

  if (images.length > 10) {
    return { ok: false, code: "VALIDATION", message: "Up to 10 images are allowed" };
  }

  if (images.some((f) => !f.mimeType.startsWith("image/"))) {
    return { ok: false, code: "VALIDATION", message: "Only image files are allowed" };
  }

  // Telegram caption limit is 0-1024 characters after entities parsing.
  // Apply a strict hard limit to avoid partial delivery attempts.
  if (input.content.length > 1024) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Message is too long for an image caption (max 1024 characters)",
    };
  }

  return { ok: true };
}

