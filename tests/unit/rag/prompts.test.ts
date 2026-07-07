import { describe, expect, it } from "vitest";

import type { RetrievedChunk } from "@/src/db/knowledgeChunks";
import { hasUsableContext, buildUserPrompt } from "@/src/rag/prompts";

describe("hasUsableContext", () => {
  it("returns false for empty chunks", () => {
    expect(hasUsableContext([])).toBe(false);
  });

  it("returns true when best distance is below threshold", () => {
    const chunks: RetrievedChunk[] = [
      {
        id: 1,
        sourceType: "sdk_doc",
        sourcePath: "a.md",
        title: "A",
        content: "text",
        metadata: null,
        distance: 0.2,
      },
    ];
    expect(hasUsableContext(chunks)).toBe(true);
  });

  it("returns false when all distances are high", () => {
    const chunks: RetrievedChunk[] = [
      {
        id: 1,
        sourceType: "sdk_doc",
        sourcePath: "a.md",
        title: "A",
        content: "text",
        metadata: null,
        distance: 0.9,
      },
    ];
    expect(hasUsableContext(chunks)).toBe(false);
  });

  it("returns true for borderline distances below default threshold", () => {
    const chunks: RetrievedChunk[] = [
      {
        id: 1,
        sourceType: "api_spec",
        sourcePath: "stories",
        title: "Stories",
        content: "text",
        metadata: null,
        distance: 0.61,
      },
    ];
    expect(hasUsableContext(chunks)).toBe(true);
  });
});

describe("buildUserPrompt", () => {
  it("includes question, sources and source URL", () => {
    const prompt = buildUserPrompt({
      question: "Как подключить SDK?",
      chunks: [
        {
          id: 1,
          sourceType: "sdk_doc",
          sourcePath: "android.md",
          title: "Android",
          content: "Gradle dependency…",
          metadata: {
            sourceUrl: "https://docs.inappstory.ru/sdk-guides/android/how-to-get-started",
          },
          distance: 0.1,
        },
      ],
      recentMessages: [{ role: "user", content: "Привет" }],
    });
    expect(prompt).toContain("Как подключить SDK?");
    expect(prompt).toContain("Gradle dependency");
    expect(prompt).toContain("Привет");
    expect(prompt).toContain("URL: https://docs.inappstory.ru/sdk-guides/android/how-to-get-started");
  });
});
