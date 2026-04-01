export type BroadcastImageLike = { mimeType: string };

const MAX_BROADCAST_CAPTION_LENGTH = 1024;

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

  if (input.content.length > MAX_BROADCAST_CAPTION_LENGTH) {
    return {
      ok: false,
      code: "VALIDATION",
      message: `Message is too long for an image caption (max ${MAX_BROADCAST_CAPTION_LENGTH} characters)`,
    };
  }

  return { ok: true };
}

