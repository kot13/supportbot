import { z } from "zod";

export const attachmentMetaSchema = z.object({
  originalFilename: z.string().nullable().optional(),
  mimeType: z.string().min(1),
  sizeBytes: z.coerce.number().int().nonnegative(),
});

export const draftSaveBodySchema = z.object({
  content: z.string(),
  format: z.enum(["html", "plain"]).default("html"),
  targetMode: z.enum(["all", "subset"]),
  chatIds: z.array(z.coerce.number().int().positive()).default([]),
  attachmentMeta: z.array(attachmentMetaSchema).optional(),
});

export type DraftSaveBody = z.infer<typeof draftSaveBodySchema>;

export const composeAttachmentSchema = z.object({
  ordinal: z.number().int(),
  original_filename: z.string().nullable(),
  mime_type: z.string(),
  size_bytes: z.number().int(),
});

export const composePayloadSchema = z.object({
  source_broadcast_id: z.number().int(),
  content: z.string(),
  format: z.enum(["html", "plain"]),
  target_mode: z.enum(["all", "subset"]),
  chat_ids: z.array(z.number().int()),
  attachments: z.array(composeAttachmentSchema),
  skipped_recipients: z.number().int(),
});
