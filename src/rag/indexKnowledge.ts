import path from "node:path";

import {
  clearKnowledgeChunks,
  countKnowledgeChunks,
  upsertKnowledgeChunk,
} from "@/src/db/knowledgeChunks";
import { getBotSettings } from "@/src/db/botSettings";
import {
  completeIndexRun,
  failIndexRun,
  startIndexRun,
} from "@/src/db/knowledgeIndexRuns";

import { chunkCsvResources } from "./chunkers/csvResources";
import { hashChunkContent } from "./chunkers/markdown";
import { chunkMarkdownDocs } from "./chunkers/markdown";
import { chunkOpenApiYaml } from "./chunkers/openApiYaml";
import { embedTexts } from "./embed";
import { buildSourceUrl } from "./sourceUrls";

const BATCH_SIZE = 20;

const DATA_ROOT = path.join(process.cwd(), "data");

export type IndexKnowledgeResult =
  | { ok: true; chunkCount: number; runId: number }
  | { ok: false; error: string; runId?: number };

export async function indexKnowledge(): Promise<IndexKnowledgeResult> {
  const settings = await getBotSettings();
  const embeddingModel = settings.embedding_model;
  const runId = await startIndexRun();
  try {
    const mdChunks = await chunkMarkdownDocs(path.join(DATA_ROOT, "docs-master", "docs"));
    const csvChunks = await chunkCsvResources(path.join(DATA_ROOT, "resources.csv"));
    const apiChunks = await chunkOpenApiYaml(path.join(DATA_ROOT, "inappstory-pub-api-v1.yaml"));

    const all = [
      ...mdChunks.map((c) => ({ ...c, sourceType: "sdk_doc" as const })),
      ...csvChunks.map((c) => ({ ...c, sourceType: "console_article" as const })),
      ...apiChunks.map((c) => ({ ...c, sourceType: "api_spec" as const })),
    ];

    await clearKnowledgeChunks();

    for (let i = 0; i < all.length; i += BATCH_SIZE) {
      const batch = all.slice(i, i + BATCH_SIZE);
      const embeddings = await embedTexts(batch.map((c) => c.content));
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j]!;
        const embedding = embeddings[j]!;
        const metadata: Record<string, unknown> = { ...(chunk.metadata ?? {}) };
        const sourceUrl = buildSourceUrl(chunk.sourceType, chunk.sourcePath, metadata);
        if (sourceUrl) {
          metadata.sourceUrl = sourceUrl;
        }

        await upsertKnowledgeChunk({
          sourceType: chunk.sourceType,
          sourcePath: chunk.sourcePath,
          title: chunk.title,
          content: chunk.content,
          contentHash: hashChunkContent(chunk.content),
          embedding,
          metadata: Object.keys(metadata).length > 0 ? metadata : null,
        });
      }
    }

    const chunkCount = await countKnowledgeChunks();
    await completeIndexRun(runId, chunkCount, embeddingModel);
    return { ok: true, chunkCount, runId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Index failed";
    await failIndexRun(runId, message);
    return { ok: false, error: message, runId };
  }
}
