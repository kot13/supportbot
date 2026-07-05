import { describe, expect, it } from "vitest";

import { isStartCommand } from "@/src/telegram/updates";

describe("isStartCommand", () => {
  it("matches /start", () => {
    expect(isStartCommand("/start")).toBe(true);
    expect(isStartCommand("  /start  ")).toBe(true);
  });

  it("matches /start with bot username", () => {
    expect(isStartCommand("/start@inappstoryfaqbot")).toBe(true);
  });

  it("matches /start with deep-link payload", () => {
    expect(isStartCommand("/start ref123")).toBe(true);
  });

  it("does not match other commands or text", () => {
    expect(isStartCommand("/help")).toBe(false);
    expect(isStartCommand("привет")).toBe(false);
    expect(isStartCommand("/starting")).toBe(false);
  });
});
