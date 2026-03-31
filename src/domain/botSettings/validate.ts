import { z } from "zod";

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
});

export type BotSettingsUpdateInput = z.infer<typeof BotSettingsUpdateSchema>;

