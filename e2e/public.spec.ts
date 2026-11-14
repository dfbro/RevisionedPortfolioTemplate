import { expect, test } from "@playwright/test";

test("template home renders placeholders without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/YOUR\s*NAME/i);
  await expect(page.getByText("technology · projects · writing")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("mobile navigation is an opaque full-screen overlay and closes with Escape", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobile menu only exists below the desktop breakpoint");
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  const header = page.locator("header").first();
  await expect(menu).toBeVisible();
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => header.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(await page.evaluate(() => innerHeight) - 1);

  const overlay = await header.evaluate((header) => ({
    height: header.getBoundingClientRect().height,
    viewportHeight: window.innerHeight,
    background: getComputedStyle(header).backgroundColor,
    blend: getComputedStyle(header).mixBlendMode,
    scrollLock: document.documentElement.style.overflow,
    transitionDuration: getComputedStyle(header).transitionDuration,
    menuTransitionDuration: getComputedStyle(document.querySelector("#mobile-menu")!).transitionDuration,
  }));
  expect(overlay.height).toBeGreaterThanOrEqual(overlay.viewportHeight - 1);
  expect(overlay.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(overlay.blend).toBe("normal");
  expect(overlay.scrollLock).toBe("hidden");
  expect(Number.parseFloat(overlay.transitionDuration)).toBeGreaterThan(0);
  expect(Number.parseFloat(overlay.menuTransitionDuration)).toBeGreaterThan(0);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#mobile-menu")).toHaveAttribute("aria-hidden", "true");
  await expect(header).toHaveAttribute("data-nav-state", "closed");
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});

test("mobile menu finishes its close animation before navigating to another page", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobile menu only exists below the desktop breakpoint");
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const header = page.locator("header").first();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu).toBeVisible();
  const currentUrl = page.url();

  await menu.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(header).toHaveAttribute("data-nav-state", "closing");
  expect(page.url()).toBe(currentUrl);
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(header).toHaveAttribute("data-nav-state", "closed");
});

test("mobile menu navigation respects reduced-motion preferences", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobile menu only exists below the desktop breakpoint");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const header = page.locator("header").first();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(header).toHaveAttribute("data-nav-state", "closed");
});

test("template places the activity heatmap after the record and before the closing quote", async ({ page }) => {
  await page.goto("/");
  // ActivitySection is streamed through Suspense; wait for both streamed siblings before comparing DOM order.
  const activitySection = page.locator("main > section:has(.hm-card)");
  const closingQuote = page.locator("main > blockquote");
  await expect(activitySection).toHaveCount(1, { timeout: 10000 });
  await expect(closingQuote).toHaveCount(1, { timeout: 10000 });

  const order = await page.locator("main").evaluate((main) => {
    const children = Array.from(main.children);
    const activity = main.querySelector(":scope > section:has(.hm-card)");
    const quote = main.querySelector(":scope > blockquote");
    const record = Array.from(main.querySelectorAll(":scope > section")).find((section) =>
      section.querySelector(":scope > div .meta")?.textContent?.toLowerCase().includes("record"),
    );
    return {
      recordBeforeActivity: Boolean(record && activity && children.indexOf(record) < children.indexOf(activity)),
      activityBeforeQuote: Boolean(activity && quote && children.indexOf(activity) < children.indexOf(quote)),
    };
  });
  expect(order.recordBeforeActivity).toBe(true);
  expect(order.activityBeforeQuote).toBe(true);
});

test("template preloads the about portrait before its section enters the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const image = page.locator(".about-photo img");
  await expect(image).toHaveCount(1);

  const absoluteTop = await image.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.max(0, absoluteTop - viewportHeight - 250));
  const beforeViewport = await image.evaluate((node) => ({ top: node.getBoundingClientRect().top, viewportHeight: window.innerHeight }));
  expect(beforeViewport.top).toBeGreaterThan(beforeViewport.viewportHeight);
  await expect(image).toHaveAttribute("src", /profile\.svg/);
  await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const afterLoad = await image.evaluate((node) => ({ top: node.getBoundingClientRect().top, viewportHeight: window.innerHeight }));
  expect(afterLoad.top).toBeGreaterThan(afterLoad.viewportHeight);
});

test("first visit to home opens behind the preloader, which then lifts", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion", "no preloader when motion is reduced");
  await page.goto("/");
  const loader = page.getByRole("status", { name: "Loading" });
  await expect(loader).toBeVisible();
  await expect(loader).toHaveCount(0, { timeout: 8000 });
  expect(await page.evaluate(() => sessionStorage.getItem("intro-seen"))).toBe("1");
  await page.reload();
  await expect(page.getByRole("status", { name: "Loading" })).toBeHidden();
});

test("all sections become visible after scrolling (nothing stuck at opacity 0)", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("intro-seen", "1"));
  await page.goto("/");
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  const hidden = await page.$$eval("main li, main h2, main p", (els) =>
    els
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.height > 0 && getComputedStyle(e).opacity === "0" && !e.closest("[aria-hidden]");
      })
      .map((e) => e.textContent?.slice(0, 40)),
  );
  expect(hidden).toEqual([]);
});

test("empty writeups index and the generic links page render", async ({ page }) => {
  await page.goto("/writeups");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Writeups");
  await page.goto("/links");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("YOUR BRAND");
});

test("about page renders the configured placeholder profile", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/YOUR\s*ALIAS/i);
  await expect(page.getByText("Your Name · Your City")).toBeVisible();
});

test("contact stays unconfigured until an email address is added", async ({ page }) => {
  await page.goto("/about");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.getByText("Contact details are not configured yet.")).toBeVisible();
});

test("404 page", async ({ page }) => {
  const res = await page.goto("/writeups/nope-nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("footer displays configured brand and profile owner", async ({ page }) => {
  await page.goto("/about");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await expect(page.locator("footer").getByText("YOUR BRAND").first()).toBeAttached();
  await expect(page.locator("footer").getByText(/© .* Your Name/)).toBeAttached();
});

test("empty projects and achievements routes render", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Projects");
  await page.goto("/achievements");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Record");
});
