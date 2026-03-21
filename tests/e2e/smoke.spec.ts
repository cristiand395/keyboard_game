import { expect, test } from "@playwright/test";

test("home page renders primary CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /mecanografia/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /empezar a jugar/i })).toBeVisible();
});

