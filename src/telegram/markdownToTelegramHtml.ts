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

/** Convert a subset of Markdown (code blocks, links, bold/italic) to Telegram HTML. */
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

  text = escapeHtml(text);
  return text.replace(/\uE000(\d+)\uE000/g, (_match, index) => preserved[Number(index)]!);
}
