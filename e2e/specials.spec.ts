import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
});

// The shop has not published any verified specials, so production must show the empty state.
test.describe("homepage specials (production build)", () => {
  test("shows the Weekly Specials heading and a polished empty state with the Instagram link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 2, name: /Weekly Specials/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Specials change every week" })).toBeVisible();
    const ig = page.getByRole("link", { name: /See this week's deals on Instagram/ });
    await expect(ig).toHaveAttribute("href", /instagram\.com\/hamzebrothersfruitmarket/);
    await expect(page.locator(".special-card")).toHaveCount(0);
  });

  test("never publishes sample or flyer prices", async ({ page, request }) => {
    const html = await (await request.get("/")).text();
    for (const text of ["sample-", "Sample condition", "Expired sample", "$9.99", "WEEKEND", "49¢"]) {
      expect(html).not.toContain(text);
    }
    await page.goto("/");
    await expect(page.getByText(/Sample content/)).toHaveCount(0);
  });

  test("the development preview is a 404 and is not indexed or listed", async ({ request }) => {
    const res = await request.get("/dev/specials-preview");
    expect(res.status()).toBe(404);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("dev/specials-preview");
  });

  test("the hero fruit platter is still the homepage hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('img[src*="hero-fruit-platter"]').first()).toBeVisible();
  });

  test("without JavaScript the heading, hero and an Instagram fallback stay visible", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 2, name: /Weekly Specials/i })).toBeVisible();
    await expect(page.getByText(/Specials need JavaScript to check their dates/)).toBeVisible();
    await expect(page.locator('img[src*="hero-fruit-platter"]').first()).toBeVisible();
    await context.close();
  });

  test("reduced motion: the specials section is usable and its leaves do not animate", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Specials change every week" })).toBeVisible();
    const names = await page
      .locator(".specials-leaf")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n === "none")).toBe(true);
    await context.close();
  });
});
