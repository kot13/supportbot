import { describe, expect, it } from "vitest";

import {
  ANSWER_MODELS,
  DEFAULT_ANSWER_MODEL,
  DEFAULT_EMBEDDING_MODEL,
  EMBEDDING_MODELS,
  normalizeIndexedEmbeddingModel,
} from "@/src/domain/botSettings/models";
import { BotSettingsUpdateSchema } from "@/src/domain/botSettings/validate";

describe("botSettings models", () => {
  it("exposes expected defaults", () => {
    expect(DEFAULT_ANSWER_MODEL).toBe("gpt-4.1");
    expect(DEFAULT_EMBEDDING_MODEL).toBe("text-embedding-3-small");
    expect(ANSWER_MODELS).toContain("gpt-5.5");
    expect(EMBEDDING_MODELS).toContain("text-embedding-3-large");
  });

  it("normalizes missing historical embedding model to default", () => {
    expect(normalizeIndexedEmbeddingModel(null)).toBe("text-embedding-3-small");
    expect(normalizeIndexedEmbeddingModel(undefined)).toBe("text-embedding-3-small");
    expect(normalizeIndexedEmbeddingModel("text-embedding-3-large")).toBe(
      "text-embedding-3-large",
    );
  });
});

describe("BotSettingsUpdateSchema", () => {
  it("accepts model fields", () => {
    const parsed = BotSettingsUpdateSchema.parse({
      answerModel: "gpt-5.5",
      embeddingModel: "text-embedding-3-large",
    });
    expect(parsed.answerModel).toBe("gpt-5.5");
    expect(parsed.embeddingModel).toBe("text-embedding-3-large");
  });

  it("rejects invalid answer model", () => {
    expect(() =>
      BotSettingsUpdateSchema.parse({ answerModel: "gpt-3.5-turbo" }),
    ).toThrow();
  });

  it("rejects invalid embedding model", () => {
    expect(() =>
      BotSettingsUpdateSchema.parse({ embeddingModel: "ada-002" }),
    ).toThrow();
  });
});
