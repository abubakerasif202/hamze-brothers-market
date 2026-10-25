import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
});

test.describe("narrow phones", () => {
  for (const width of [320, 340, 360, 375]) {
    test(`header brand is fully readable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto("/");
      const brand = await page.evaluate(() => {
        const spans = [...document.querySelectorAll("header a[href='/'] span")];
        const name = spans.find((s) => s.textContent?.trim() === "Hamze Brothers")!;
        const sub = spans.find((s) => s.textContent?.trim() === "FRUIT MARKET · GUILDFORD")!;
        const shown = getComputedStyle(sub).display !== "none";
        return {
          nameClipped: name.scrollWidth > name.clientWidth,
          subShown: shown,
          subClipped: shown && sub.scrollWidth > sub.clientWidth,
        };
      });
      expect(brand.nameClipped).toBe(false);
      expect(brand.subClipped).toBe(false);
      // The subtitle only appears once there is room for it in full.
      expect(brand.subShown).toBe(width >= 360);
      // The menu control stays inside the viewport.
      const toggle = await page.locator('button[aria-controls="mobile-menu"]').boundingBox();
      expect(toggle!.x + toggle!.width).toBeLessThanOrEqual(width);
    });
  }

  test("basket item names wrap in full and the stepper drops below at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/shop");
    for (const name of ["Navel oranges", "Orange & passionfruit juice", "Granny Smith apples"]) {
      await page.getByRole("button", { name: new RegExp(`^Add ${name}`) }).click();
    }
    await page.getByRole("button", { name: /View demo basket/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const rows = await dialog.locator("li p.font-semibold").evaluateAll((els) =>
      els.map((p) => ({
        text: p.textContent,
        clipped: p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1,
      })),
    );
    expect(rows.map((r) => r.text)).toEqual(["Navel oranges", "Orange & passionfruit juice", "Granny Smith apples"]);
    for (const row of rows) expect(row.clipped, row.text ?? "").toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });

  test("desktop basket sidebar keeps the name and stepper readable", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/shop");
    await page.getByRole("button", { name: /^Add Navel oranges/ }).click();
    const row = page.locator("#basket li").first();
    await expect(row).toContainText("Navel oranges");
    const clipped = await row
      .locator("p.font-semibold")
      .evaluate((p) => p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1);
    expect(clipped).toBe(false);
  });
});
