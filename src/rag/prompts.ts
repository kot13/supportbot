import type { RetrievedChunk } from "@/src/db/knowledgeChunks";

export type RecentMessage = { role: "user" | "bot"; content: string };

export const SYSTEM_PROMPT = `Ты — ассистент поддержки по продукту InAppStory (SDK, консоль управления, публичное API).
Отвечай только на основе предоставленного контекста из документации.
Если в контексте нет достаточной информации для обоснованного ответа, явно скажи, что не можешь ответить по документации — не выдумывай шаги, API или настройки.
Отвечай на том же языке, что и вопрос пользователя.
Будь конкретным и практичным.
Форматируй ответ в Markdown: блоки кода \`\`\`js ... \`\`\`, инлайн-код \`...\`, **жирный** при необходимости.

Правила ссылок в ответе (используй URL из блока «URL:» контекста, если он указан):
- Документация SDK: [текст](https://docs.inappstory.ru/{path}) — без суффикса .md
- Статьи консоли: [текст](https://console.inappstory.ru/docs/{slug})
- Публичное REST API: [текст](https://api.inappstory.ru/pub/v1#/)

Запрещено: ссылки вида resources.csv#, внутренние id статей, домен docs.inappstory.com.`;

function chunkSourceUrl(chunk: RetrievedChunk): string | null {
  const url = chunk.metadata?.sourceUrl;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

export function buildUserPrompt(input: {
  question: string;
  chunks: RetrievedChunk[];
  recentMessages: RecentMessage[];
}): string {
  const contextBlocks = input.chunks.map((c, i) => {
    const label = c.title ?? c.sourcePath;
    const sourceUrl = chunkSourceUrl(c);
    const urlLine = sourceUrl ? `URL: ${sourceUrl}` : "URL: —";
    return `[Источник ${i + 1}: ${c.sourceType} / ${label}]\n${urlLine}\n${c.content}`;
  });

  const history =
    input.recentMessages.length > 0
      ? input.recentMessages.map((m) => `${m.role === "user" ? "Пользователь" : "Бот"}: ${m.content}`).join("\n")
      : "(нет предыдущих сообщений)";

  return `Контекст из базы знаний:
${contextBlocks.length ? contextBlocks.join("\n\n---\n\n") : "(релевантный контекст не найден)"}

Недавняя переписка в чате:
${history}

Вопрос пользователя:
${input.question}`;
}

export function hasUsableContext(chunks: RetrievedChunk[]): boolean {
  if (chunks.length === 0) return false;
  const maxDistance = ragMaxDistance();
  const best = chunks[0]?.distance ?? 1;
  return best < maxDistance;
}

function ragMaxDistance(): number {
  const raw = process.env.RAG_MAX_DISTANCE?.trim();
  const n = raw ? Number(raw) : 0.62;
  return Number.isFinite(n) && n > 0 ? n : 0.62;
}
