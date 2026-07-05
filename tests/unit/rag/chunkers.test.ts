import { describe, expect, it } from "vitest";

import { parseCsvRecords } from "@/src/rag/chunkers/csvResources";
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
