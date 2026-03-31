import { test, expect } from "@playwright/test";

// Smoke test expects the app is running and DB is prepared (migrated + seeded),
// plus at least one chat exists and bot token is set.
test("sign-in page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

