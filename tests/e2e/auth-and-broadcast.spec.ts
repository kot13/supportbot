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

test("root redirects to /chats after sign-in", async ({ page }) => {
  const login = process.env.ADMIN_LOGIN ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await page.goto("/login");
  await page.getByLabel("Login").fill(login);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.goto("/");
  await page.waitForURL("/chats");
});

test("broadcast preview preserves line breaks", async ({ page }) => {
  const login = process.env.ADMIN_LOGIN ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await page.goto("/login");
  await page.getByLabel("Login").fill(login);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.goto("/broadcast");

  const text = "line 1\n\nline 3";
  await page.getByTestId("message-textarea").fill(text);

  const previewText = await page.getByTestId("message-preview").innerText();
  expect(previewText).toContain("line 1");
  expect(previewText).toContain("line 3");
  expect(previewText).toContain("\n\n");
});

test("broadcast history ID links to in-panel details page", async ({ page }) => {
  const login = process.env.ADMIN_LOGIN ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await page.goto("/login");
  await page.getByLabel("Login").fill(login);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.goto("/broadcast/history");
  const detailLink = page.locator('a[href^="/broadcast/history/"]').first();
  if ((await detailLink.count()) === 0) {
    test.skip(true, "No broadcast rows — seed DB or send a broadcast before this e2e.");
    return;
  }

  const href = await detailLink.getAttribute("href");
  expect(href).toMatch(/^\/broadcast\/history\/\d+$/);

  await detailLink.click();
  await expect(page).toHaveURL(/\/broadcast\/history\/\d+$/);
  await expect(page.getByRole("heading", { name: /Broadcast #\d+/ })).toBeVisible();
});

