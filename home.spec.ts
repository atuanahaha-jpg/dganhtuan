import { test, expect } from "@playwright/test";

test("homepage renders the core Photoshop experience", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /discover beautiful moments/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /explore trending/i })).toBeVisible();
});

test("registration form is accessible", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});
