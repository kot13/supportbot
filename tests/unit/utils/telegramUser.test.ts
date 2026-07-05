import { describe, expect, it } from "vitest";

import { formatTelegramUserDisplayName, telegramUserHref } from "@/src/utils/telegramUser";

describe("formatTelegramUserDisplayName", () => {
  it("prefers first name, then username, then id", () => {
    expect(
      formatTelegramUserDisplayName({
        firstName: "Pavel",
        username: "pavel",
        telegramUserId: 1,
      }),
    ).toBe("Pavel");
    expect(formatTelegramUserDisplayName({ username: "pavel", telegramUserId: 1 })).toBe("@pavel");
    expect(formatTelegramUserDisplayName({ telegramUserId: 42 })).toBe("User 42");
    expect(formatTelegramUserDisplayName({ fallback: "Chat title" })).toBe("Chat title");
  });
});

describe("telegramUserHref", () => {
  it("builds t.me link for username or tg deep link for id", () => {
    expect(telegramUserHref({ username: "pavel" })).toBe("https://t.me/pavel");
    expect(telegramUserHref({ telegramUserId: 123 })).toBe("tg://user?id=123");
    expect(telegramUserHref({})).toBeNull();
  });
});
