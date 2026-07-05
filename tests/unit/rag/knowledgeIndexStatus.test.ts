import { describe, expect, it } from "vitest";

import { normalizeIndexedEmbeddingModel } from "@/src/domain/botSettings/models";

describe("knowledge index status helpers", () => {
  it("treats unknown indexed model as historical default", () => {
    expect(normalizeIndexedEmbeddingModel("unknown")).toBe("text-embedding-3-small");
  });

  it("preserves known indexed models", () => {
    expect(normalizeIndexedEmbeddingModel("text-embedding-3-small")).toBe(
      "text-embedding-3-small",
    );
  });
});
