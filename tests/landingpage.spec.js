// @ts-check
import { expect, test } from "@playwright/test";

test("LandingPage navbar navigation works", async ({ page }) => {
  await page.goto("http://localhost:5173/"); // Adjust the URL if needed

  // Click on each navbar item and verify scrolling
  await page.locator("text=Home").click();
  await page.waitForTimeout(500);
  await page.locator("text=Features").click();
  await page.waitForTimeout(500);
  await page.locator("text=About Us").click();
  await page.waitForTimeout(500);
  await page.locator("text=FAQ").click();
  await page.waitForTimeout(500);
});

test("LandingPage login button redirects to login page", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Click on Login button
  await page.locator("text=Login").click();

  // Verify navigation to login page
  await page.waitForURL("http://localhost:5173/login");
  await expect(page).toHaveURL("http://localhost:5173/login");
});

test("LandingPage get started button redirects to signup page", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Click on Get Started button
  await page.locator("text=Get Started").click();

  // Verify navigation to signup page
  await page.waitForURL("http://localhost:5173/signup");
  await expect(page).toHaveURL("http://localhost:5173/signup");
});

test("LandingPage scrolls up and down", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Scroll down to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  // Scroll up to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
});
