import { searchSimilarChunks } from "@/src/db/knowledgeChunks";

import { embedText } from "./embed";

function ragTopK(): number {
  const raw = process.env.RAG_TOP_K?.trim();
  const n = raw ? Number(raw) : 6;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 20) : 6;
}

export async function retrieveContext(query: string) {
  const embedding = await embedText(query);
  const chunks = await searchSimilarChunks(embedding, ragTopK());
  return chunks;
}
