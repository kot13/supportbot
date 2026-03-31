import { z } from "zod";

const SeedEnvSchema = z.object({
  ADMIN_LOGIN: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
});

export type SeedEnv = z.infer<typeof SeedEnvSchema>;

export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

export function getSeedEnv(): SeedEnv {
  return SeedEnvSchema.parse({
    ADMIN_LOGIN: process.env.ADMIN_LOGIN,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  });
}

