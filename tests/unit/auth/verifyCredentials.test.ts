import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/db/adminUsers", () => ({ findAdminUserByLogin: vi.fn() }));

import { verifyCredentials } from "@/src/auth/verifyCredentials";
import { findAdminUserByLogin } from "@/src/db/adminUsers";

describe("verifyCredentials", () => {
  it("throws generic invalid error if user not found", async () => {
    vi.mocked(findAdminUserByLogin).mockResolvedValueOnce(null);

    await expect(verifyCredentials("nope", "pass")).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
      status: 401,
    });
  });
});

