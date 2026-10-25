import { expect, test } from "@playwright/test";

// Runs against `next dev`: /dev/specials-preview is 404 in production builds.
const PREVIEW = "/dev/specials-preview";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
});

test.describe("weekly specials design (sample content)", () => {
  test("shows the active sample offers with prices, units and dates, in four columns on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PREVIEW);
    const heading = page.getByRole("heading", { level: 2, name: /Weekly Specials/i });
    await expect(heading).toBeVisible();
    await expect(page.getByRole("note")).toContainText("Sample content only");
    const cards = page.locator(".special-card");
    await expect(cards).toHaveCount(8);
    await expect(cards.first()).toContainText("Oranges");
    await expect(cards.first()).toContainText("$1.00");
    await expect(cards.first()).toContainText("kg");
    await expect(cards.first()).toContainText("Sat, 7 Nov to Sun, 8 Nov");
    await expect(page.getByText("Sample condition: while stocks last")).toBeVisible();

    await cards.last().scrollIntoViewIfNeeded();
    await expect(cards.last()).toBeVisible();
    const lefts = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
    expect(new Set(lefts).size).toBe(4);
    const widths = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
    const frames = await cards
      .locator("img")
      .evaluateAll((els) => els.map((e) => e.parentElement!.getBoundingClientRect()));
    for (const r of frames) expect(r.width / r.height).toBeCloseTo(4 / 3, 1);
  });

  test("an expired offer never shows, even when it is in the data", async ({ page }) => {
    await page.goto(`${PREVIEW}?state=mixed`);
    await expect(page.locator(".special-card")).toHaveCount(8);
    await expect(page.getByText("Expired sample")).toHaveCount(0);
    await expect(page.getByText("$9.99")).toHaveCount(0);
  });

  for (const url of [`${PREVIEW}?today=2026-11-10`, `${PREVIEW}?state=empty`]) {
    test(`shows the empty state with the Instagram link (${url.split("?")[1]})`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator(".special-card")).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Specials change every week" })).toBeVisible();
      const ig = page.getByRole("link", { name: /Instagram/ });
      await expect(ig.first()).toHaveAttribute("href", /instagram\.com\/hamzebrothersfruitmarket/);
    });
  }

  for (const [width, columns] of [
    [320, 1],
    [375, 2],
    [768, 2],
    [1024, 4],
  ] as const) {
    test(`at ${width}px: ${columns} column(s), no horizontal overflow, prices readable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(PREVIEW);
      const cards = page.locator(".special-card");
      await cards.last().scrollIntoViewIfNeeded();
      await expect(cards.last()).toBeVisible();
      const lefts = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
      expect(new Set(lefts).size).toBe(columns);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      const clipped = await page.evaluate(
        () =>
          [...document.querySelectorAll(".special-card p.text-white")].filter((p) => p.scrollWidth > p.clientWidth + 1)
            .length,
      );
      expect(clipped).toBe(0);
    });
  }

  test("reduced motion: everything visible immediately, leaves and hovers do not move", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(PREVIEW);
    const cards = page.locator(".special-card");
    await expect(cards.last()).toBeVisible();
    expect(await page.locator(".reveal").count()).toBe(0);
    const animations = await page
      .locator(".specials-leaf")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));
    expect(animations.every((a) => a === "none")).toBe(true);
    await cards.first().hover();
    const transform = await cards.first().evaluate((e) => getComputedStyle(e).transform);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
    await context.close();
  });

  test("with motion allowed, off-screen cards reveal on scroll and the leaves drift", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await page.goto(PREVIEW);
    const last = page.locator(".special-card").last();
    await expect(page.locator(".specials-leaf").first()).toHaveCSS("animation-name", "specials-sway");
    await last.scrollIntoViewIfNeeded();
    await expect(last.locator("xpath=ancestor::div[contains(@class,'reveal')]")).toHaveClass(/is-in/);
    await expect(last).toBeVisible();
  });

  test("keyboard: the section's only interactive control is reachable with a visible focus ring", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PREVIEW);
    const link = page.getByRole("link", { name: "How specials work" });
    await link.focus();
    await expect(link).toBeFocused();
    const outline = await link.evaluate(
      (e) => getComputedStyle(e).outlineStyle + " " + getComputedStyle(e).outlineWidth,
    );
    expect(outline).not.toMatch(/^none/);
  });
});
