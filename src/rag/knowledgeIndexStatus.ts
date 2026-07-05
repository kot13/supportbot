import { getBotSettings } from "@/src/db/botSettings";
import { countKnowledgeChunks } from "@/src/db/knowledgeChunks";
import {
  getLatestCompletedIndexRun,
  getLatestIndexRun,
  getRunningIndexRun,
} from "@/src/db/knowledgeIndexRuns";
import { normalizeIndexedEmbeddingModel } from "@/src/domain/botSettings/models";

export type KnowledgeIndexState =
  | "never_indexed"
  | "current"
  | "outdated"
  | "running"
  | "failed";

export type KnowledgeIndexStatus = {
  state: KnowledgeIndexState;
  currentEmbeddingModel: string;
  indexedEmbeddingModel: string | null;
  lastCompletedAt: string | null;
  lastChunkCount: number | null;
  runningStartedAt: string | null;
  lastError: string | null;
};

export async function getKnowledgeIndexStatus(): Promise<KnowledgeIndexStatus> {
  const settings = await getBotSettings();
  const currentEmbeddingModel = settings.embedding_model;

  const running = await getRunningIndexRun();
  if (running) {
    const lastCompleted = await getLatestCompletedIndexRun();
    const indexedEmbeddingModel = lastCompleted
      ? normalizeIndexedEmbeddingModel(lastCompleted.embedding_model)
      : null;

    return {
      state: "running",
      currentEmbeddingModel,
      indexedEmbeddingModel,
      lastCompletedAt: lastCompleted?.finished_at?.toISOString() ?? null,
      lastChunkCount: lastCompleted?.chunk_count ?? null,
      runningStartedAt: running.started_at.toISOString(),
      lastError: null,
    };
  }

  const chunkCount = await countKnowledgeChunks();
  const lastCompleted = await getLatestCompletedIndexRun();
  const lastRun = await getLatestIndexRun();

  const hasValidIndex =
    chunkCount > 0 &&
    lastCompleted !== null &&
    (lastCompleted.chunk_count ?? 0) > 0;

  if (!hasValidIndex) {
    const lastError =
      lastRun?.status === "failed" ? (lastRun.error_message ?? "Indexing failed") : null;

    return {
      state: lastRun?.status === "failed" ? "failed" : "never_indexed",
      currentEmbeddingModel,
      indexedEmbeddingModel: null,
      lastCompletedAt: null,
      lastChunkCount: null,
      runningStartedAt: null,
      lastError,
    };
  }

  const indexedEmbeddingModel = normalizeIndexedEmbeddingModel(lastCompleted.embedding_model);

  if (currentEmbeddingModel !== indexedEmbeddingModel) {
    return {
      state: "outdated",
      currentEmbeddingModel,
      indexedEmbeddingModel,
      lastCompletedAt: lastCompleted.finished_at?.toISOString() ?? null,
      lastChunkCount: lastCompleted.chunk_count,
      runningStartedAt: null,
      lastError: null,
    };
  }

  if (lastRun?.status === "failed") {
    return {
      state: "failed",
      currentEmbeddingModel,
      indexedEmbeddingModel,
      lastCompletedAt: lastCompleted.finished_at?.toISOString() ?? null,
      lastChunkCount: lastCompleted.chunk_count,
      runningStartedAt: null,
      lastError: lastRun.error_message ?? "Indexing failed",
    };
  }

  return {
    state: "current",
    currentEmbeddingModel,
    indexedEmbeddingModel,
    lastCompletedAt: lastCompleted.finished_at?.toISOString() ?? null,
    lastChunkCount: lastCompleted.chunk_count,
    runningStartedAt: null,
    lastError: null,
  };
}

export async function isKnowledgeIndexCurrent(): Promise<boolean> {
  const status = await getKnowledgeIndexStatus();
  return status.state === "current";
}
