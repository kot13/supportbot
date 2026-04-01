import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isActiveFromChatMember,
  normalizeUpdateToChat,
} from "@/src/telegram/updates";

describe("isActiveFromChatMember", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false for left when user is our bot (is_bot)", () => {
    const r = isActiveFromChatMember({
      user: { id: 1, is_bot: true, first_name: "B" },
      status: "left",
    });
    expect(r).toBe(false);
  });

  it("returns true for member when user is our bot", () => {
    const r = isActiveFromChatMember({
      user: { id: 1, is_bot: true, first_name: "B" },
      status: "member",
    });
    expect(r).toBe(true);
  });

  it("matches TELEGRAM_BOT_USER_ID over is_bot", () => {
    vi.stubEnv("TELEGRAM_BOT_USER_ID", "42");
    expect(
      isActiveFromChatMember({
        user: { id: 42, is_bot: false, first_name: "Named" },
        status: "kicked",
      }),
    ).toBe(false);
    expect(
      isActiveFromChatMember({
        user: { id: 99, is_bot: true, first_name: "Other" },
        status: "left",
      }),
    ).toBe(null);
  });
});

describe("normalizeUpdateToChat", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sets isActive true for message-like updates", () => {
    const u = {
      message: {
        message_id: 1,
        date: 1,
        chat: { id: -1001, type: "supergroup", title: "G" },
      },
    };
    const c = normalizeUpdateToChat(u);
    expect(c?.isActive).toBe(true);
    expect(c?.telegramChatId).toBe("-1001");
    expect(c?.title).toBe("G");
  });

  it("uses first_name as title when title and username missing", () => {
    const u = {
      message: {
        message_id: 1,
        date: 1,
        chat: { id: 42, type: "private", first_name: "Alice" },
      },
    };
    const c = normalizeUpdateToChat(u);
    expect(c?.title).toBe("Alice");
  });

  it("sets isActive false from my_chat_member when bot left", () => {
    const u = {
      my_chat_member: {
        chat: { id: -1002, type: "supergroup", title: "G2" },
        new_chat_member: {
          user: { id: 7, is_bot: true, first_name: "Bot" },
          status: "left",
        },
      },
    };
    const c = normalizeUpdateToChat(u);
    expect(c?.isActive).toBe(false);
    expect(c?.telegramChatId).toBe("-1002");
  });

  it("defaults isActive true when new_chat_member is not our bot", () => {
    const u = {
      my_chat_member: {
        chat: { id: -1003, type: "supergroup", title: "G3" },
        new_chat_member: {
          user: { id: 99, is_bot: false, first_name: "Human" },
          status: "member",
        },
      },
    };
    const c = normalizeUpdateToChat(u);
    expect(c?.isActive).toBe(true);
  });
});
