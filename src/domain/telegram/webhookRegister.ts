import { z } from "zod";

export const WebhookRegisterBodySchema = z.object({
  url: z.string().trim().min(1).max(2048),
});

export type WebhookRegisterBody = z.infer<typeof WebhookRegisterBodySchema>;

/** Returns null if URL is not a valid https URL with http(s) host. */
export function parseHttpsWebhookUrl(url: string): URL | null {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    if (!u.hostname) return null;
    return u;
  } catch {
    return null;
  }
}
