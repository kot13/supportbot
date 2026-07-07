import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { chunkCsvResources, parseCsvRecords } from "@/src/rag/chunkers/csvResources";
import { hashChunkContent } from "@/src/rag/chunkers/markdown";

describe("markdown chunker helpers", () => {
  it("hashes content deterministically", () => {
    const a = hashChunkContent("hello");
    const b = hashChunkContent("hello");
    expect(a).toBe(b);
    expect(a).not.toBe(hashChunkContent("world"));
  });
});

describe("csv parser", () => {
  it("parses quoted fields with commas", () => {
    const rows = parseCsvRecords('id,title\n1,"Hello, world"');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toEqual(["1", "Hello, world"]);
  });
});

describe("chunkCsvResources", () => {
  it("includes slug and sourceUrl in metadata", async () => {
    const csv = `id,type,status,slug,category,title,content,created_at,updated_at
99,1,10,roles-management,Cat,Title,"<p>Body text</p>",0,0`;
    const file = path.join(tmpdir(), `resources-${Date.now()}.csv`);
    await writeFile(file, csv);
    try {
      const chunks = await chunkCsvResources(file);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]?.metadata?.slug).toBe("roles-management");
      expect(chunks[0]?.metadata?.sourceUrl).toBe(
        "https://console.inappstory.ru/docs/roles-management",
      );
    } finally {
      await unlink(file);
    }
  });
});
