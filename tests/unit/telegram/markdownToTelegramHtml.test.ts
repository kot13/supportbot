import { describe, expect, it } from "vitest";

import {
  markdownToTelegramHtml,
  resolveDocUrl,
  sanitizeMarkdownForTelegram,
} from "@/src/telegram/markdownToTelegramHtml";

describe("resolveDocUrl", () => {
  it("resolves relative doc paths against docs.inappstory.ru", () => {
    expect(resolveDocUrl("/sdk-guides/android/user-settings")).toBe(
      "https://docs.inappstory.ru/sdk-guides/android/user-settings",
    );
    expect(resolveDocUrl("https://example.com/x")).toBe("https://example.com/x");
  });

  it("normalizes legacy docs.inappstory.com to .ru", () => {
    expect(resolveDocUrl("https://docs.inappstory.com/sdk-guides/android/foo")).toBe(
      "https://docs.inappstory.ru/sdk-guides/android/foo",
    );
  });

  it("normalizes legacy console.inappstory.com links", () => {
    expect(resolveDocUrl("https://console.inappstory.com/console/docs/roles-management")).toBe(
      "https://console.inappstory.ru/docs/roles-management",
    );
  });
});

describe("sanitizeMarkdownForTelegram", () => {
  it("converts ATX headers to bold", () => {
    expect(sanitizeMarkdownForTelegram("## Шаги")).toBe("**Шаги**");
    expect(sanitizeMarkdownForTelegram("### Подраздел")).toBe("**Подраздел**");
  });

  it("converts GFM tables to list items", () => {
    const input = `| Параметр | Значение |
|----------|----------|
| apiKey | string |`;
    const output = sanitizeMarkdownForTelegram(input);
    expect(output).not.toContain("|");
    expect(output).toContain("- Параметр — Значение");
    expect(output).toContain("- apiKey — string");
  });

  it("removes horizontal rules", () => {
    const output = sanitizeMarkdownForTelegram("Первый блок\n---\nВторой блок");
    expect(output).not.toMatch(/^---$/m);
    expect(output).toContain("Первый блок");
    expect(output).toContain("Второй блок");
  });

  it("preserves fenced code blocks including hash lines", () => {
    const input = "```js\n# not a header\nconst x = 1;\n```";
    expect(sanitizeMarkdownForTelegram(input)).toBe(input);
  });

  it("is idempotent", () => {
    const input = "## Title\n\nSome text";
    const once = sanitizeMarkdownForTelegram(input);
    const twice = sanitizeMarkdownForTelegram(once);
    expect(twice).toBe(once);
  });

  it("sanitizes mixed answer without raw markup artifacts", () => {
    const input = `## Шаги

| Параметр | Значение |
|----------|----------|
| apiKey | string |

Важный абзац.

---`;

    const output = sanitizeMarkdownForTelegram(input);
    expect(output).not.toMatch(/^#/m);
    expect(output).not.toContain("|");
    expect(output).not.toMatch(/^---$/m);
    expect(output).toContain("**Шаги**");
    expect(output).toContain("- apiKey — string");
    expect(output).toContain("Важный абзац.");
  });
});

describe("markdownToTelegramHtml", () => {
  it("converts fenced code blocks", () => {
    const html = markdownToTelegramHtml("```js\nconst x = 1;\n```");
    expect(html).toContain("<pre><code>const x = 1;</code></pre>");
  });

  it("converts markdown links", () => {
    const html = markdownToTelegramHtml("[Android](/sdk-guides/android/user-settings)");
    expect(html).toContain('<a href="https://docs.inappstory.ru/sdk-guides/android/user-settings">Android</a>');
  });

  it("converts inline code and bold", () => {
    const html = markdownToTelegramHtml("Use `npm install` and **important**");
    expect(html).toContain("<code>npm install</code>");
    expect(html).toContain("<b>important</b>");
  });

  it("converts strikethrough", () => {
    const html = markdownToTelegramHtml("~~deprecated~~");
    expect(html).toContain("<s>deprecated</s>");
  });

  it("handles mixed formatting", () => {
    const html = markdownToTelegramHtml(
      "**Bold** and [link](/sdk-guides/android/foo) with `code`",
    );
    expect(html).toContain("<b>Bold</b>");
    expect(html).toContain('<a href="https://docs.inappstory.ru/sdk-guides/android/foo">link</a>');
    expect(html).toContain("<code>code</code>");
  });

  it("escapes raw html in plain text", () => {
    const html = markdownToTelegramHtml("a < b");
    expect(html).toBe("a &lt; b");
  });
});
