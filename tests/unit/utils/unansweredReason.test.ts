import { describe, expect, it } from "vitest";

import { formatUnansweredReason } from "@/src/utils/unansweredReason";

describe("formatUnansweredReason", () => {
  it("maps known reasons to Russian labels", () => {
    expect(formatUnansweredReason("no_context")).toBe("Нет контекста в документации");
    expect(formatUnansweredReason("openai_error")).toBe("Ошибка OpenAI");
  });

  it("returns raw reason for unknown values", () => {
    expect(formatUnansweredReason("custom")).toBe("custom");
  });
});
