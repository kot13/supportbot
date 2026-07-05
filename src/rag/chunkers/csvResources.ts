import { readFile } from "node:fs/promises";

import type { RawChunk } from "./markdown";

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Minimal RFC-style CSV parser for quoted multiline fields. */
export function parseCsvRecords(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && next === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      continue;
    }
    field += ch;
  }
  row.push(field);
  if (row.some((c) => c.length > 0)) rows.push(row);
  return rows;
}

export async function chunkCsvResources(csvPath: string): Promise<RawChunk[]> {
  const text = await readFile(csvPath, "utf-8");
  const records = parseCsvRecords(text);
  if (records.length < 2) return [];

  const header = records[0]!;
  const idIdx = header.indexOf("id");
  const titleIdx = header.indexOf("title");
  const categoryIdx = header.indexOf("category");
  const contentIdx = header.indexOf("content");

  const chunks: RawChunk[] = [];
  for (let i = 1; i < records.length; i++) {
    const rec = records[i]!;
    const id = idIdx >= 0 ? rec[idIdx] : String(i);
    const title = titleIdx >= 0 ? rec[titleIdx] : null;
    const category = categoryIdx >= 0 ? rec[categoryIdx] : null;
    const rawContent = contentIdx >= 0 ? rec[contentIdx] : "";
    const plain = stripHtml(rawContent ?? "");
    if (!plain) continue;

    const content = title ? `${title}\n\n${plain}` : plain;
    chunks.push({
      sourcePath: `resources.csv#${id}`,
      title: title ?? null,
      content,
      metadata: { category, id },
    });
  }

  return chunks;
}
