import { describe, expect, it } from "vitest";

import { isHelpIntent } from "@/src/telegram/updates";

describe("isHelpIntent", () => {
  it("matches /help command", () => {
    expect(isHelpIntent("/help")).toBe(true);
    expect(isHelpIntent("/help@inappstoryfaqbot")).toBe(true);
  });

  it("matches capability questions", () => {
    expect(isHelpIntent("На какие вопросы ты можешь ответить?")).toBe(true);
    expect(isHelpIntent("что ты умеешь")).toBe(true);
    expect(isHelpIntent("Чем вы можете помочь?")).toBe(true);
    expect(isHelpIntent("какие вопросы вы можете ответить")).toBe(true);
  });

  it("matches short help phrases", () => {
    expect(isHelpIntent("помощь")).toBe(true);
    expect(isHelpIntent("Help")).toBe(true);
  });

  it("does not match documentation questions", () => {
    expect(isHelpIntent("Как подключить SDK на Android?")).toBe(false);
    expect(isHelpIntent("Как опубликовать сторис?")).toBe(false);
    expect(isHelpIntent("/start")).toBe(false);
  });
});
