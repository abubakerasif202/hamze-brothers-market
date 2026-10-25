import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("hb-intro-seen", "1"));
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test("opens, moves focus in, traps Tab, closes on Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("#mobile-menu");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link").first()).toBeFocused();

    // Tab around well past the number of focusable items: focus must never leave toggle + panel.
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.closest("#mobile-menu")
          ? "panel"
          : el?.getAttribute("aria-controls") === "mobile-menu"
            ? "toggle"
            : "outside";
      });
      expect(where, `Tab ${i + 1}`).not.toBe("outside");
    }
    await page.keyboard.press("Shift+Tab");

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("navigates via the menu and closes it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Visit" }).click();
    await expect(page).toHaveURL(/\/visit$/);
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });
});

test.describe("keyboard and focus", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("skip link is the first stop and becomes visible", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("interactive controls show a visible focus indicator", async ({ page }) => {
    await page.goto("/shop");
    const add = page.getByRole("button", { name: /^Add .* to demo basket$/ }).first();
    await add.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(add).toBeFocused();
    const style = await add.evaluate((el) => {
      const s = getComputedStyle(el);
      return { width: parseFloat(s.outlineWidth), style: s.outlineStyle, shadow: s.boxShadow };
    });
    const visible = (style.style !== "none" && style.width > 0) || style.shadow !== "none";
    expect(visible, JSON.stringify(style)).toBe(true);
  });

  test("header stays pinned while scrolling", async ({ page }) => {
    await page.goto("/shop");
    await page.evaluate(() => window.scrollTo(0, 1500));
    const box = await page.locator("header").first().boundingBox();
    expect(box?.y).toBe(0);
  });
});

test.describe("dialogs", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("product dialog traps focus, closes on Escape and returns focus to its opener", async ({ page }) => {
    await page.goto("/shop");
    const opener = page.getByRole("button", { name: /View details for Carrot juice/ });
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/Carrot juice/);
    // A native modal cycles through its own controls and the browser UI (document.body), never the inert page behind it.
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return "browser";
        return el.closest("dialog") ? `dialog:${el.textContent?.trim().slice(0, 20)}` : "page";
      });
      expect(where, `Tab ${i + 1}`).not.toBe("page");
      seen.add(where);
    }
    expect(seen.size).toBeGreaterThan(1);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("close button and backdrop click both dismiss", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: /View details for Bananas/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: /View details for Bananas/ }).click();
    await page.mouse.click(5, 450);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
