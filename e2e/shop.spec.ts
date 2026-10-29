import { expect, test } from "@playwright/test";

const routes = ["/", "/produce", "/shop", "/specials", "/our-market", "/visit"];
const widths = [320, 375, 768, 1024, 1440];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
});

test.describe("routes", () => {
  for (const route of routes) {
    test(`${route} loads cleanly at every width without overflow or broken images`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      for (const width of widths) {
        await page.setViewportSize({ width, height: 800 });
        const res = await page.goto(route);
        expect(res?.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState("networkidle");
      const broken = await page.evaluate(() =>
        [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      );
      expect(broken).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("hero", () => {
  test("uses authentic market photography", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('.market-hero img[src*="in-store-display"]')).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("family");
    await expect(page.getByText(/Rated 4\.8/)).toHaveCount(0);
  });
});

test.describe("harvest boxes", () => {
  test("add a bundle on the home page; the basket persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Add box Pressed juice trio/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "Pressed juice trio added" })).toBeAttached();
    await expect(page.getByRole("link", { name: /Demo basket, 3 items/ })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("link", { name: /Demo basket, 3 items/ })).toBeVisible();
  });

  test("shop journey: bundle, search, filter, product details, stepper", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/shop");
    await page.getByText(/Quick-Fill/).click();
    await page.getByRole("button", { name: /Add box Levantine mezze crate/ }).click();
    await expect(page.getByRole("heading", { name: /Demo basket/ }).first()).toBeVisible();

    await page.getByRole("searchbox", { name: /Search the demo catalogue/ }).fill("mango");
    await expect(page.getByText(/1 product matching/)).toBeVisible();
    await page.getByRole("button", { name: "Clear search input" }).click();
    await page.getByRole("button", { name: /^Fresh Juices/ }).click();
    await expect(page.getByRole("button", { name: /^Fresh Juices/ })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: /View details for Carrot juice/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("mobile: basket sheet opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/shop");
    await page.getByRole("button", { name: /View demo basket/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("reduced motion", () => {
  test("content stays usable", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('.market-hero img[src*="in-store-display"]')).toBeVisible();
    await context.close();
  });
});
