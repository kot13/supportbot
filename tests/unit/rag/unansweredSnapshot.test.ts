import { describe, expect, it } from "vitest";

import type { RetrievedChunk } from "@/src/db/knowledgeChunks";
import { buildUnansweredContextSnapshot } from "@/src/rag/unansweredSnapshot";

const sampleChunk: RetrievedChunk = {
  id: 42,
  sourceType: "sdk_doc",
  sourcePath: "sdk-guides/android/how-to-get-started.md",
  title: "Getting started",
  content: "Install the SDK…",
  metadata: { section: "install" },
  distance: 0.71,
};

describe("buildUnansweredContextSnapshot", () => {
  it("builds empty snapshot when search was not performed", () => {
    const snapshot = buildUnansweredContextSnapshot({
      searchPerformed: false,
      chunks: [],
      recentMessages: [],
    });

    expect(snapshot).toEqual({
      searchPerformed: false,
      chunkCount: 0,
      bestDistance: null,
      recentMessages: [],
      retrievedChunks: [],
    });
  });

  it("maps retrieved chunks and dialog context for no_context", () => {
    const snapshot = buildUnansweredContextSnapshot({
      searchPerformed: true,
      chunks: [sampleChunk],
      recentMessages: [
        { role: "user", content: "How to install?" },
        { role: "bot", content: "Previous answer" },
      ],
    });

    expect(snapshot.searchPerformed).toBe(true);
    expect(snapshot.chunkCount).toBe(1);
    expect(snapshot.bestDistance).toBe(0.71);
    expect(snapshot.recentMessages).toHaveLength(2);
    expect(snapshot.retrievedChunks[0]).toMatchObject({
      chunkId: 42,
      sourceType: "sdk_doc",
      sourcePath: "sdk-guides/android/how-to-get-started.md",
      distance: 0.71,
      metadata: { section: "install" },
    });
  });

  it("records search performed with empty chunks after failed embed", () => {
    const snapshot = buildUnansweredContextSnapshot({
      searchPerformed: true,
      chunks: [],
      recentMessages: [{ role: "user", content: "Question" }],
    });

    expect(snapshot.searchPerformed).toBe(true);
    expect(snapshot.chunkCount).toBe(0);
    expect(snapshot.bestDistance).toBe(null);
    expect(snapshot.retrievedChunks).toEqual([]);
  });
});
