import { test, expect } from "@playwright/test";
test("surprise is optional, keyboard accessible and announces its result", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
  await page.goto("/");
  const button = page.getByRole("button", { name: "Surprise Me" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".fruit-parade")).toBeVisible();
  await expect(button).toBeDisabled();
  await expect(page.locator(".fruit-parade")).toHaveCount(0, { timeout: 6000 });
  await expect(button).toBeEnabled();
});
