import type { Pool } from "pg";

import { getPool } from "./pool";

export type KnowledgeSourceType = "sdk_doc" | "console_article" | "api_spec";

export type KnowledgeChunkInput = {
  sourceType: KnowledgeSourceType;
  sourcePath: string;
  title?: string | null;
  content: string;
  contentHash: string;
  embedding: number[];
  metadata?: Record<string, unknown> | null;
};

export type RetrievedChunk = {
  id: number;
  sourceType: KnowledgeSourceType;
  sourcePath: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  distance: number;
};

function vectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function upsertKnowledgeChunk(
  input: KnowledgeChunkInput,
  pool: Pool = getPool(),
): Promise<void> {
  await pool.query(
    `
      insert into knowledge_chunks (
        source_type, source_path, title, content, content_hash, embedding, metadata
      )
      values ($1, $2, $3, $4, $5, $6::vector, $7::jsonb)
      on conflict (source_type, source_path, content_hash) do update set
        title = excluded.title,
        content = excluded.content,
        embedding = excluded.embedding,
        metadata = excluded.metadata,
        updated_at = now()
    `,
    [
      input.sourceType,
      input.sourcePath,
      input.title ?? null,
      input.content,
      input.contentHash,
      vectorLiteral(input.embedding),
      input.metadata ? JSON.stringify(input.metadata) : null,
    ],
  );
}

export async function clearKnowledgeChunks(pool: Pool = getPool()): Promise<void> {
  await pool.query("truncate table knowledge_chunks restart identity");
}

export async function countKnowledgeChunks(pool: Pool = getPool()): Promise<number> {
  const res = await pool.query<{ c: string }>("select count(*)::text as c from knowledge_chunks");
  return Number(res.rows[0]?.c ?? 0);
}

export async function searchSimilarChunks(
  embedding: number[],
  topK: number,
  pool: Pool = getPool(),
): Promise<RetrievedChunk[]> {
  const res = await pool.query<
    RetrievedChunk & { source_type: KnowledgeSourceType; source_path: string }
  >(
    `
      select
        id,
        source_type as "sourceType",
        source_path as "sourcePath",
        title,
        content,
        metadata,
        (embedding <=> $1::vector) as distance
      from knowledge_chunks
      order by embedding <=> $1::vector
      limit $2
    `,
    [vectorLiteral(embedding), topK],
  );
  return res.rows.map((r) => ({
    id: r.id,
    sourceType: r.sourceType,
    sourcePath: r.sourcePath,
    title: r.title,
    content: r.content,
    metadata: r.metadata,
    distance: Number(r.distance),
  }));
}
