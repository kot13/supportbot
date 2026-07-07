import { describe, expect, it } from "vitest";

import { markdownToTelegramHtml, resolveDocUrl } from "@/src/telegram/markdownToTelegramHtml";

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

  it("escapes raw html in plain text", () => {
    const html = markdownToTelegramHtml("a < b");
    expect(html).toBe("a &lt; b");
  });
});
