import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type RawChunk = {
  sourcePath: string;
  title: string | null;
  content: string;
  metadata?: Record<string, unknown>;
};

const MAX_CHUNK_CHARS = 2000;
const OVERLAP_CHARS = 100;

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function hashChunkContent(content: string): string {
  return hashContent(content);
}

function splitLongText(text: string): string[] {
  if (text.length <= MAX_CHUNK_CHARS) return [text];
  const parts: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + MAX_CHUNK_CHARS, text.length);
    parts.push(text.slice(start, end));
    if (end >= text.length) break;
    start = end - OVERLAP_CHARS;
  }
  return parts;
}

function splitMarkdownByHeadings(content: string, filePath: string): RawChunk[] {
  const lines = content.split("\n");
  const sections: Array<{ title: string | null; body: string[] }> = [];
  let currentTitle: string | null = path.basename(filePath);
  let currentBody: string[] = [];

  const flush = () => {
    const body = currentBody.join("\n").trim();
    if (body) sections.push({ title: currentTitle, body: [body] });
    currentBody = [];
  };

  for (const line of lines) {
    const heading = line.match(/^#{2,3}\s+(.+)$/);
    if (heading) {
      flush();
      currentTitle = heading[1]!.trim();
      continue;
    }
    currentBody.push(line);
  }
  flush();

  if (sections.length === 0 && content.trim()) {
    sections.push({ title: path.basename(filePath), body: [content.trim()] });
  }

  const chunks: RawChunk[] = [];
  for (const section of sections) {
    const text = section.body.join("\n\n").trim();
    for (const part of splitLongText(text)) {
      chunks.push({
        sourcePath: filePath,
        title: section.title,
        content: part,
        metadata: { section: section.title },
      });
    }
  }
  return chunks;
}

async function walkMarkdownFiles(dir: string, baseDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(full, baseDir)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path.relative(baseDir, full));
    }
  }
  return files;
}

export async function chunkMarkdownDocs(docsRoot: string): Promise<RawChunk[]> {
  const absRoot = path.resolve(docsRoot);
  const relFiles = await walkMarkdownFiles(absRoot, absRoot);
  const chunks: RawChunk[] = [];
  for (const rel of relFiles.sort()) {
    const full = path.join(absRoot, rel);
    const content = await readFile(full, "utf-8");
    chunks.push(...splitMarkdownByHeadings(content, rel));
  }
  return chunks;
}
