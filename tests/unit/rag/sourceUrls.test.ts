import { describe, expect, it } from "vitest";

import {
  buildApiSpecUrl,
  buildConsoleArticleUrl,
  buildSdkDocUrl,
  buildSourceUrl,
} from "@/src/rag/sourceUrls";

describe("buildSdkDocUrl", () => {
  it("strips docs/ prefix and .md extension", () => {
    expect(buildSdkDocUrl("sdk-guides/android/how-to-get-started.md")).toBe(
      "https://docs.inappstory.ru/sdk-guides/android/how-to-get-started",
    );
  });

  it("handles nested paths", () => {
    expect(buildSdkDocUrl("glossarium/statistics/stories-widget-events.md")).toBe(
      "https://docs.inappstory.ru/glossarium/statistics/stories-widget-events",
    );
  });
});

describe("buildConsoleArticleUrl", () => {
  it("builds console docs URL from slug", () => {
    expect(buildConsoleArticleUrl("roles-management")).toBe(
      "https://console.inappstory.ru/docs/roles-management",
    );
  });

  it("returns null for empty slug", () => {
    expect(buildConsoleArticleUrl("")).toBeNull();
    expect(buildConsoleArticleUrl(null)).toBeNull();
    expect(buildConsoleArticleUrl(undefined)).toBeNull();
    expect(buildConsoleArticleUrl("   ")).toBeNull();
  });
});

describe("buildApiSpecUrl", () => {
  it("returns API portal base URL", () => {
    expect(buildApiSpecUrl()).toBe("https://api.inappstory.ru/pub/v1#/");
    expect(buildApiSpecUrl({ method: "get", path: "/v1/stories" })).toBe(
      "https://api.inappstory.ru/pub/v1#/",
    );
  });
});

describe("buildSourceUrl", () => {
  it("dispatches by source type", () => {
    expect(buildSourceUrl("sdk_doc", "sdk-guides/android/foo.md", null)).toBe(
      "https://docs.inappstory.ru/sdk-guides/android/foo",
    );
    expect(
      buildSourceUrl("console_article", "resources.csv#12", { slug: "roles-management" }),
    ).toBe("https://console.inappstory.ru/docs/roles-management");
    expect(buildSourceUrl("api_spec", "GET /v1/stories", { method: "get", path: "/v1/stories" })).toBe(
      "https://api.inappstory.ru/pub/v1#/",
    );
  });

  it("returns null for console article without slug", () => {
    expect(buildSourceUrl("console_article", "resources.csv#11", { id: "11" })).toBeNull();
  });
});
