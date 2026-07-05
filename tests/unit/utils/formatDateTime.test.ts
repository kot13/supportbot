import { describe, expect, it } from "vitest";

import { formatChatDateTime } from "@/src/utils/formatDateTime";

describe("formatChatDateTime", () => {
  it("formats with fixed ru-RU locale and Moscow timezone", () => {
    const formatted = formatChatDateTime("2026-07-05T08:03:47.000Z");
    expect(formatted).toMatch(/05\.07\.2026/);
    expect(formatted).toMatch(/11:03:47/);
  });
});
