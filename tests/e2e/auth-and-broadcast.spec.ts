import { test, expect } from "@playwright/test";

// Smoke test expects the app is running and DB is prepared (migrated + seeded),
// plus at least one chat exists and bot token is set.
test("sign-in page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("sign out invalidates session and protects /bot", async ({ page }) => {
  const login = process.env.ADMIN_LOGIN ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await page.goto("/login");
  await page.getByLabel("Login").fill(login);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  // We should land on the panel and see Sign out.
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("/login");

  // After logout, protected pages should redirect back to /login.
  await page.goto("/bot");
  await page.waitForURL("/login");
});

