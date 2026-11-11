import { expect, test } from "@playwright/test";

test("template home renders placeholders without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/YOUR\s*NAME/i);
  await expect(page.getByText("technology · projects · writing")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
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
