import { readFile } from "node:fs/promises";

import { parse as parseYaml } from "yaml";

import type { RawChunk } from "./markdown";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options"] as const;

type OpenApiDoc = {
  paths?: Record<string, Record<string, unknown>>;
};

function stringifyPart(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export async function chunkOpenApiYaml(yamlPath: string): Promise<RawChunk[]> {
  const text = await readFile(yamlPath, "utf-8");
  const doc = parseYaml(text) as OpenApiDoc;
  const paths = doc.paths ?? {};
  const chunks: RawChunk[] = [];

  for (const [pathKey, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation || typeof operation !== "object") continue;
      const op = operation as Record<string, unknown>;
      const summary = typeof op.summary === "string" ? op.summary : null;
      const description = typeof op.description === "string" ? op.description : "";
      const operationId = typeof op.operationId === "string" ? op.operationId : null;
      const tags = Array.isArray(op.tags) ? op.tags.join(", ") : "";

      const parts = [
        `${method.toUpperCase()} ${pathKey}`,
        summary ? `Summary: ${summary}` : "",
        description ? `Description: ${description}` : "",
        tags ? `Tags: ${tags}` : "",
        op.parameters ? `Parameters:\n${stringifyPart(op.parameters)}` : "",
        op.requestBody ? `Request body:\n${stringifyPart(op.requestBody)}` : "",
        op.responses ? `Responses:\n${stringifyPart(op.responses)}` : "",
      ].filter(Boolean);

      const content = parts.join("\n\n").slice(0, 32000);
      if (!content.trim()) continue;

      chunks.push({
        sourcePath: `${method.toUpperCase()} ${pathKey}`,
        title: summary ?? `${method.toUpperCase()} ${pathKey}`,
        content,
        metadata: { operationId, path: pathKey, method },
      });
    }
  }

  return chunks;
}
