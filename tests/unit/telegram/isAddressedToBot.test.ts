import { describe, expect, it } from "vitest";

import { isAddressedToBot } from "@/src/telegram/updates";

describe("isAddressedToBot", () => {
  it("returns true for private chats", () => {
    expect(
      isAddressedToBot(
        { chatType: "private", replyToBot: false, mentionUsernames: [], text: "hello" },
        null,
      ),
    ).toBe(true);
  });

  it("returns true for group when bot is mentioned via entity", () => {
    expect(
      isAddressedToBot(
        {
          chatType: "supergroup",
          replyToBot: false,
          mentionUsernames: ["SupportBot"],
          text: "@SupportBot question",
        },
        "supportbot",
      ),
    ).toBe(true);
  });

  it("returns true for group when @username is only in plain text", () => {
    expect(
      isAddressedToBot(
        {
          chatType: "supergroup",
          replyToBot: false,
          mentionUsernames: [],
          text: "@inappstoryfaqbot как подключить SDK?",
        },
        "inappstoryfaqbot",
      ),
    ).toBe(true);
  });

  it("returns true for group when replying to bot", () => {
    expect(
      isAddressedToBot(
        { chatType: "group", replyToBot: true, mentionUsernames: [], text: "follow up" },
        null,
      ),
    ).toBe(true);
  });

  it("returns false for group without mention or reply", () => {
    expect(
      isAddressedToBot(
        {
          chatType: "supergroup",
          replyToBot: false,
          mentionUsernames: [],
          text: "общий вопрос без упоминания",
        },
        "supportbot",
      ),
    ).toBe(false);
  });

  it("returns false when bot username is unknown in group", () => {
    expect(
      isAddressedToBot(
        {
          chatType: "supergroup",
          replyToBot: false,
          mentionUsernames: ["inappstoryfaqbot"],
          text: "@inappstoryfaqbot question",
        },
        null,
      ),
    ).toBe(false);
  });
});
