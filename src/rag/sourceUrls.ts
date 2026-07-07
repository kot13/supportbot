import type { KnowledgeSourceType } from "@/src/db/knowledgeChunks";

const SDK_DOCS_BASE = "https://docs.inappstory.ru";
const CONSOLE_DOCS_BASE = "https://console.inappstory.ru/docs";
const API_DOCS_BASE = "https://api.inappstory.ru/pub/v1#/";

export function buildSdkDocUrl(sourcePath: string): string {
  let relativePath = sourcePath.trim().replace(/^docs\//i, "");
  relativePath = relativePath.replace(/\.md$/i, "");
  return `${SDK_DOCS_BASE}/${relativePath.replace(/^\/+/, "")}`;
}

export function buildConsoleArticleUrl(slug: string | null | undefined): string | null {
  const normalized = slug?.trim();
  if (!normalized) return null;
  return `${CONSOLE_DOCS_BASE}/${normalized}`;
}

export function buildApiSpecUrl(input?: { method?: string; path?: string }): string {
  void input;
  return API_DOCS_BASE;
}

export function buildSourceUrl(
  sourceType: KnowledgeSourceType,
  sourcePath: string,
  metadata?: Record<string, unknown> | null,
): string | null {
  switch (sourceType) {
    case "sdk_doc":
      return buildSdkDocUrl(sourcePath);
    case "console_article": {
      const slug = metadata?.slug;
      return buildConsoleArticleUrl(typeof slug === "string" ? slug : null);
    }
    case "api_spec":
      return buildApiSpecUrl({
        method: typeof metadata?.method === "string" ? metadata.method : undefined,
        path: typeof metadata?.path === "string" ? metadata.path : undefined,
      });
    default:
      return null;
  }
}
