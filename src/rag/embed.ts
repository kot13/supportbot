import OpenAI from "openai";

import { getBotSettings } from "@/src/db/botSettings";
import {
  DEFAULT_EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
  type EmbeddingModel,
} from "@/src/domain/botSettings/models";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

export function requireOpenAiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }
  return apiKey;
}

async function resolveEmbeddingModel(): Promise<EmbeddingModel> {
  const settings = await getBotSettings();
  return settings.embedding_model ?? DEFAULT_EMBEDDING_MODEL;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const openai = getClient();
  const model = await resolveEmbeddingModel();
  const res = await openai.embeddings.create({
    model,
    input: texts,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return res.data
    .sort((a, b) => a.index - b.index)
    .map((row) => row.embedding);
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  if (!embedding) throw new Error("Empty embedding response");
  return embedding;
}

export const embeddingDimensions = EMBEDDING_DIMENSIONS;
