// @ts-check
import { expect, test } from "@playwright/test";

test("view balance on homepage", async ({ page }) => {
  await page.goto("http://localhost:5173/homepage");

  // Assert that balance section is visible
  await expect(page.locator("p.text-3xl.font-bold")).toContainText("Rs");

  // Optional: Assert that the balance is not null or loading
  const balanceText = await page.locator("p.text-3xl.font-bold").innerText();
  expect(balanceText).not.toBe("Loading...");
});

test("navigate to Add Balance page", async ({ page }) => {
  await page.goto("http://localhost:5173/homepage");

  // Click on the 'Recharge' button
  await page.locator('button:has-text("Recharge")').click();

  // Wait for navigation to the Add Balance page
  await page.waitForURL("http://localhost:5173/addbalance");

  // Assert that the URL is correct
  await expect(page).toHaveURL("http://localhost:5173/addbalance");
});

test("navigate to Send Credits page", async ({ page }) => {
  await page.goto("http://localhost:5173/homepage");

  // Click on the 'Send' button
  await page.locator('button:has-text("Send")').click();

  // Wait for navigation to the Send Credits page
  await page.waitForURL("http://localhost:5173/sendcredits");

  // Assert that the URL is correct
  await expect(page).toHaveURL("http://localhost:5173/sendcredits");
});

test("log out from homepage", async ({ page }) => {
  await page.goto("http://localhost:5173/homepage");

  // Click on the 'Log Out' button (Make sure the 'Log Out' button is clickable and visible)
  await page.locator("p:has-text('Log Out')").click();

  // Wait for the page to redirect to the login page
  await page.waitForURL("http://localhost:5173/login");

  // Assert that the user is redirected to the login page
  await expect(page).toHaveURL("http://localhost:5173/login");
});
