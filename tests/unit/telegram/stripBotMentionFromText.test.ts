import { describe, expect, it } from "vitest";

import { stripBotMentionFromText } from "@/src/telegram/updates";

describe("stripBotMentionFromText", () => {
  it("removes @bot mention from question", () => {
    expect(
      stripBotMentionFromText("@inappstoryfaqbot можно ли через API создавать сториз?", "inappstoryfaqbot"),
    ).toBe("можно ли через API создавать сториз?");
  });

  it("returns trimmed text when no mention", () => {
    expect(stripBotMentionFromText("  hello  ", "bot")).toBe("hello");
  });
});
