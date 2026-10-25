import { expect, test } from "@playwright/test";

test.describe("opening intro", () => {
  test("plays on first visit, can be skipped, and stays gone for the session", async ({ page }) => {
    // Don't wait for the load event: on a busy machine it can outlast the 3.6s intro itself.
    await page.goto("/", { waitUntil: "commit" });
    const intro = page.locator(".intro");
    await expect(intro).toBeVisible();
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expect(intro).toHaveCount(0);

    await page.goto("/specials");
    await page.goto("/");
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("does not block the page when left alone", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".intro")).toHaveCount(0, { timeout: 8000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("is skipped entirely under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".intro")).toBeHidden();
    await expect(page.getByRole("link", { name: /shop online/i })).toBeVisible();
    await context.close();
  });
});

test.describe("fruit characters", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
  });

  test("Mr Banana dances on the fifth click", async ({ page }) => {
    await page.goto("/");
    const banana = page.getByRole("button", { name: /Mr Banana/ });
    // Banana bobs forever, so Playwright's "stable" wait never settles. Click where he
    // currently is with a real mouse event instead of forcing the click.
    const clickBanana = async () => {
      const box = await banana.boundingBox();
      if (!box) throw new Error("Mr Banana is not rendered");
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    };
    for (let i = 0; i < 4; i++) await clickBanana();
    await expect(banana).not.toHaveClass(/is-dancing/);
    await clickBanana();
    await expect(banana).toHaveClass(/is-dancing/);
  });

  test("Happy Watermelon looks surprised when clicked", async ({ page }) => {
    await page.goto("/");
    const melon = page.getByRole("button", { name: /Happy Watermelon/ });
    await melon.scrollIntoViewIfNeeded();
    await melon.click();
    await expect(melon).toHaveClass(/is-surprised/);
  });
});

test.describe("add to basket", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
  });

  test("updates the basket and fires the flying fruit and confetti", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: /^Add/ }).first().click();
    await expect(page.locator(".confetti-bit").first()).toBeAttached();
    await expect(page.locator(".fly-fruit")).toBeAttached();
    await expect(page.locator("[data-cart-icon]").first()).toContainText("1");
  });

  test("adds without effects under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/shop");
    await page.getByRole("button", { name: /^Add/ }).first().click();
    await expect(page.locator("[data-cart-icon]").first()).toContainText("1");
    await expect(page.locator(".fly-fruit")).toHaveCount(0);
    await context.close();
  });
});

test("layout has no horizontal overflow on a phone", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await context.close();
});

test.describe("site health", () => {
  const routes = ["/", "/our-market", "/produce", "/specials", "/visit", "/shop"];

  for (const route of routes) {
    test(`${route} loads without console errors or failed requests`, async ({ context, page }) => {
      await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
      const problems: string[] = [];
      page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      page.on("response", (r) => {
        // Third-party embeds (maps, reviews) load lazily and are out of scope here.
        if (r.url().startsWith("http://localhost") && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
      });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      expect(problems).toEqual([]);
    });
  }
});
