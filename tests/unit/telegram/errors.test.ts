import { describe, expect, it } from "vitest";

import { toAdminFriendlyTelegramError } from "@/src/telegram/errors";

describe("toAdminFriendlyTelegramError", () => {
  it("sanitizes failure result", () => {
    const e = toAdminFriendlyTelegramError({
      ok: false,
      errorCode: "SOME_CODE",
      errorMessage: "Something went wrong",
    });
    expect(e).toEqual({ errorCode: "SOME_CODE", errorMessage: "Something went wrong" });
  });
});

