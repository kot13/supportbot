import { test, expect } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page) {
  const login = process.env.ADMIN_LOGIN ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await page.goto("/login");
  await page.getByLabel("Login").fill(login);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
}

test("save draft and show in history", async ({ page }) => {
  await signIn(page);
  await page.goto("/broadcast");

  const text = `draft test ${Date.now()}`;
  await page.getByTestId("message-textarea").fill(text);
  await page.getByRole("button", { name: "Save draft" }).click();

  await expect(page.getByText(/Draft #\d+ saved/)).toBeVisible({ timeout: 10000 });

  await page.goto("/broadcast/history");
  await expect(page.getByText("draft").first()).toBeVisible();
});

test("compose banner when resend from history link", async ({ page }) => {
  await signIn(page);
  await page.goto("/broadcast/history");

  const resendLink = page.getByRole("link", { name: "Resend" }).first();
  if ((await resendLink.count()) === 0) {
    test.skip();
    return;
  }

  await resendLink.click();
  await expect(page.getByTestId("broadcast-context-banner")).toContainText("Based on broadcast #");
});
