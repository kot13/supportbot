import { describe, expect, it } from "vitest";

import { parseHttpsWebhookUrl } from "@/src/domain/telegram/webhookRegister";

describe("parseHttpsWebhookUrl", () => {
  it("accepts https URLs", () => {
    const u = parseHttpsWebhookUrl("https://example.com/api/telegram/webhook");
    expect(u?.hostname).toBe("example.com");
    expect(u?.protocol).toBe("https:");
  });

  it("rejects http", () => {
    expect(parseHttpsWebhookUrl("http://example.com/hook")).toBeNull();
  });

  it("rejects garbage", () => {
    expect(parseHttpsWebhookUrl("not a url")).toBeNull();
  });
});
