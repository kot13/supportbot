function docsBaseUrl(): string {
  const raw = process.env.DOCS_BASE_URL?.trim();
  return (raw || "https://docs.inappstory.ru").replace(/\/$/, "");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtmlAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

function normalizeLegacyUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "docs.inappstory.com") {
      parsed.hostname = "docs.inappstory.ru";
      return parsed.toString().replace(/\/$/, "");
    }
    if (parsed.hostname === "console.inappstory.com") {
      parsed.hostname = "console.inappstory.ru";
      parsed.pathname = parsed.pathname.replace(/^\/console\/docs\//, "/docs/");
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

export function resolveDocUrl(href: string): string {
  const trimmed = href.trim();
  if (/^https?:\/\//i.test(trimmed)) return normalizeLegacyUrl(trimmed);
  if (trimmed.startsWith("/")) return `${docsBaseUrl()}${trimmed}`;
  return `${docsBaseUrl()}/${trimmed.replace(/^\//, "")}`;
}

const FENCED_CODE_TOKEN = "\uE001";

function extractFencedCodeBlocks(text: string): { text: string; blocks: string[] } {
  const blocks: string[] = [];
  const withoutCode = text.replace(/```[^\n`]*\n?[\s\S]*?```/g, (match) => {
    const token = `${FENCED_CODE_TOKEN}${blocks.length}${FENCED_CODE_TOKEN}`;
    blocks.push(match);
    return token;
  });
  return { text: withoutCode, blocks };
}

function restoreFencedCodeBlocks(text: string, blocks: string[]): string {
  return text.replace(
    new RegExp(`${FENCED_CODE_TOKEN}(\\d+)${FENCED_CODE_TOKEN}`, "g"),
    (_match, index) => blocks[Number(index)]!,
  );
}

function isTableSeparatorLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes("|") && /^\|?[\s|:-]+$/.test(trimmed) && /-{2,}|:{2,}/.test(trimmed);
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function parseTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function tableRowToListItem(cells: string[]): string {
  const nonEmpty = cells.filter((c) => c.length > 0);
  if (nonEmpty.length === 0) return "";
  if (nonEmpty.length === 1) return `- ${nonEmpty[0]}`;
  return `- ${nonEmpty.join(" — ")}`;
}

function sanitizeLine(line: string): string {
  const headerMatch = line.match(/^#{1,6}\s+(.+)$/);
  if (headerMatch) {
    return `**${headerMatch[1]!.trim()}**`;
  }

  const trimmed = line.trim();
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
    return "";
  }

  if (/^\[\^[^\]]+\]:/.test(trimmed)) {
    return "";
  }

  if (isTableSeparatorLine(line)) {
    return "";
  }

  if (isTableRow(line)) {
    return tableRowToListItem(parseTableCells(line));
  }

  let result = line.replace(/\[\^[^\]]+\]/g, "");
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, (_match, alt: string) => alt || "");
  return result;
}

/** Strip or convert Markdown constructs that Telegram does not render. */
export function sanitizeMarkdownForTelegram(markdown: string): string {
  const { text: withoutCode, blocks } = extractFencedCodeBlocks(markdown);
  const sanitized = withoutCode.split("\n").map(sanitizeLine).join("\n");
  return restoreFencedCodeBlocks(sanitized, blocks);
}

/** Convert a subset of Markdown (code blocks, links, bold/italic/strike) to Telegram HTML. */
export function markdownToTelegramHtml(markdown: string): string {
  const preserved: string[] = [];
  const preserve = (html: string) => {
    const token = `\uE000${preserved.length}\uE000`;
    preserved.push(html);
    return token;
  };

  let text = markdown;

  text = text.replace(/```([^\n`]*)\n?([\s\S]*?)```/g, (_match, _lang, code) =>
    preserve(`<pre><code>${escapeHtml(String(code).replace(/\s+$/, ""))}</code></pre>`),
  );

  text = text.replace(/`([^`\n]+)`/g, (_match, code) =>
    preserve(`<code>${escapeHtml(String(code))}</code>`),
  );

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) =>
    preserve(
      `<a href="${escapeHtmlAttr(resolveDocUrl(String(href)))}">${escapeHtml(String(label))}</a>`,
    ),
  );

  text = text.replace(/\*\*([^*\n]+)\*\*/g, (_match, inner) =>
    preserve(`<b>${escapeHtml(String(inner))}</b>`),
  );

  text = text.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, (_match, inner) =>
    preserve(`<i>${escapeHtml(String(inner))}</i>`),
  );

  text = text.replace(/~~([^~\n]+)~~/g, (_match, inner) =>
    preserve(`<s>${escapeHtml(String(inner))}</s>`),
  );

  text = escapeHtml(text);
  return text.replace(/\uE000(\d+)\uE000/g, (_match, index) => preserved[Number(index)]!);
}
