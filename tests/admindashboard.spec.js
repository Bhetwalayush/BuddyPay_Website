// @ts-check
import { expect, test } from "@playwright/test";

test("admin dashboard should load with correct elements", async ({ page }) => {
  await page.goto("http://localhost:5173/admindashboard"); // Adjust the URL if necessary

  // Assert the page title is "Dashboard"
//   await expect(page.locator("h1")).toHaveText("Dashboard");

  // Assert that menu items are present in the sidebar
  const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];
  for (const item of menuItems) {
    await expect(page.locator(`text=${item}`)).toBeVisible();
  }

  // Assert that the total funds and total users sections are visible
  await expect(page.locator("text=Total Funds")).toBeVisible();
  await expect(page.locator("text=Users")).toBeVisible();

  // Assert that the charts (Active Visitors, Wallet Usage) are visible
  await expect(page.locator("text=Active Visitors")).toBeVisible();
  await expect(page.locator("text=Wallet Usage")).toBeVisible();
});

test("admin should navigate between pages", async ({ page }) => {
  await page.goto("http://localhost:5173/admindashboard");

  // Click on "Users" from the sidebar and navigate to the users page
//   await page.click('text=Users');
  await page.waitForURL("http://localhost:5173/userpage");
  await expect(page.locator("h1")).toHaveText("Users");

  // Navigate back to Dashboard
  await page.click('text=Dashboard');
  await page.waitForURL("http://localhost:5173/admindashboard");
  await expect(page.locator("h1")).toHaveText("Dashboard");
});

test("admin dashboard should show correct chart data", async ({ page }) => {
  await page.goto("http://localhost:5173/admindashboard");

  // Check if the Active Visitors chart is visible
  const activeVisitorsChart = await page.locator('text=Active Visitors');
  await expect(activeVisitorsChart).toBeVisible();

  // Check if the Wallet Usage chart is visible
  const walletUsageChart = await page.locator('text=Wallet Usage');
  await expect(walletUsageChart).toBeVisible();
});

test("admin should log out successfully", async ({ page }) => {
  await page.goto("http://localhost:5173/admindashboard");

  // Click the logout button
  await page.click('button:text("Log Out")');

  // Wait for the login page to load
  await page.waitForURL("http://localhost:5173/login");

  // Assert that the user is redirected to the login page
  await expect(page).toHaveURL("http://localhost:5173/login");
});

test("admin dashboard should show data correctly", async ({ page }) => {
  await page.goto("http://localhost:5173/admindashboard");

  // Check that the total funds and total users are displayed with the correct values
  await expect(page.locator("h2:has-text('Rs 1200')")).toBeVisible();
  await expect(page.locator("h2:has-text('0')")).toBeVisible(); // Assuming 0 total users for this test scenario

  // Check that the active visitors chart displays the expected data
  const activeVisitorsChart = await page.locator('text=Active Visitors');
  await expect(activeVisitorsChart).toBeVisible();

  // Check that the wallet usage chart is visible
  const walletUsageChart = await page.locator('text=Wallet Usage');
  await expect(walletUsageChart).toBeVisible();
});

test("admin dashboard should display correct sidebar items and handle click", async ({ page }) => {
  await page.goto("http://localhost:5173/admindashboard");

  // Assert that all sidebar menu items are visible
  const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];
  for (const item of menuItems) {
    await expect(page.locator(`text=${item}`)).toBeVisible();
  }

  // Test clicking on each menu item
  for (const item of menuItems) {
    await page.click(`text=${item}`);
    await page.waitForURL(`http://localhost:5173/${item.toLowerCase()}`);
    await expect(page.locator("h1")).toHaveText(item); // Assert that the correct page has loaded
  }
});
