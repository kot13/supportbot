export const ANSWER_MODELS = ["gpt-4.1", "gpt-5.5"] as const;
export const EMBEDDING_MODELS = ["text-embedding-3-small", "text-embedding-3-large"] as const;

export type AnswerModel = (typeof ANSWER_MODELS)[number];
export type EmbeddingModel = (typeof EMBEDDING_MODELS)[number];

export const DEFAULT_ANSWER_MODEL: AnswerModel = "gpt-4.1";
export const DEFAULT_EMBEDDING_MODEL: EmbeddingModel = "text-embedding-3-small";

export const EMBEDDING_DIMENSIONS = 1536;

export function normalizeIndexedEmbeddingModel(
  value: string | null | undefined,
): EmbeddingModel {
  if (value && (EMBEDDING_MODELS as readonly string[]).includes(value)) {
    return value as EmbeddingModel;
  }
  return DEFAULT_EMBEDDING_MODEL;
}

/** GPT-5.x models only accept the default temperature (1). */
export function answerModelSupportsCustomTemperature(model: AnswerModel): boolean {
  return model === "gpt-4.1";
}
