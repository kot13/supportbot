import { z } from "zod";

import { ANSWER_MODELS, EMBEDDING_MODELS } from "./models";

export const BotSettingsUpdateSchema = z.object({
  botName: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  botToken: z
    .string()
    .trim()
    .min(1)
    .max(256)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  answerModel: z.enum(ANSWER_MODELS).optional(),
  embeddingModel: z.enum(EMBEDDING_MODELS).optional(),
});

export type BotSettingsUpdateInput = z.infer<typeof BotSettingsUpdateSchema>;
