import { describe, expect, it } from "vitest";

import { canSaveDraft } from "@/src/domain/broadcast/saveDraft";

describe("canSaveDraft", () => {
  it("allows non-empty content", () => {
    expect(canSaveDraft({ content: "hi", targetMode: "subset", chatIds: [] })).toBe(true);
  });

  it("allows all chats mode without text", () => {
    expect(canSaveDraft({ content: "", targetMode: "all", chatIds: [] })).toBe(true);
  });

  it("allows subset with selected chats and no text", () => {
    expect(canSaveDraft({ content: "  ", targetMode: "subset", chatIds: [1] })).toBe(true);
  });

  it("rejects fully empty form", () => {
    expect(canSaveDraft({ content: "", targetMode: "subset", chatIds: [] })).toBe(false);
  });
});
