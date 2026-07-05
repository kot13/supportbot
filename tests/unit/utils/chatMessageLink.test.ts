import { describe, expect, it } from "vitest";

import { chatMessageAnchorId, chatMessageHref } from "@/src/utils/chatMessageLink";

describe("chatMessageLink", () => {
  it("builds anchor id and href", () => {
    expect(chatMessageAnchorId(42)).toBe("message-42");
    expect(chatMessageHref(2, 42)).toBe("/chats/2#message-42");
  });
});
