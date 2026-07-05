import type { RetrievedChunk } from "@/src/db/knowledgeChunks";
import type {
  UnansweredContextSnapshot,
  UnansweredDialogMessage,
  UnansweredRetrievedChunkSnapshot,
} from "@/src/db/unansweredContextSnapshots";

import type { RecentMessage } from "./prompts";

export function buildUnansweredContextSnapshot(input: {
  searchPerformed: boolean;
  chunks: RetrievedChunk[];
  recentMessages: RecentMessage[];
}): UnansweredContextSnapshot {
  const retrievedChunks: UnansweredRetrievedChunkSnapshot[] = input.chunks.map((c) => ({
    chunkId: c.id,
    sourceType: c.sourceType,
    sourcePath: c.sourcePath,
    title: c.title,
    content: c.content,
    metadata: c.metadata,
    distance: c.distance,
  }));

  const recentMessages: UnansweredDialogMessage[] = input.recentMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const bestDistance =
    input.searchPerformed && retrievedChunks.length > 0 ? retrievedChunks[0]!.distance : null;

  return {
    searchPerformed: input.searchPerformed,
    chunkCount: retrievedChunks.length,
    bestDistance,
    recentMessages,
    retrievedChunks,
  };
}
