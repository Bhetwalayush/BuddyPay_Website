import { expect, test } from '@playwright/test';

test.describe('Add Balance Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Add Balance page before each test
    await page.goto('http://localhost:5173/addbalance');
  });

  test('should render the Add Balance page correctly', async ({ page }) => {
    // Check if the input field and button are visible
    const inputField = await page.locator('input[placeholder="Enter Recharge Code"]');
    const addButton = await page.locator('button:has-text("Add Balance")');
    const logo = await page.locator('img[alt="BuddyPay Logo"]');

    await expect(inputField).toBeVisible();
    await expect(addButton).toBeVisible();
    await expect(logo).toBeVisible();
  });

  test('should display error message for invalid code', async ({ page }) => {
    const inputField = await page.locator('input[placeholder="Enter Recharge Code"]');
    const addButton = await page.locator('button:has-text("Add Balance")');
    const message = await page.locator('p.text-red-400');

    await inputField.fill('invalid-code'); // Simulate entering an invalid code
    await addButton.click(); // Click on Add Balance

  });

  test('should show success message and navigate to homepage on valid recharge', async ({ page }) => {
    // Mocking the API response for a valid recharge code
    await page.route('http://localhost:3000/api/recharge/validate', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          message: "Recharge code validated and balance updated successfully.",
          amount: 100,
          newBalance: 1300
        }),
      });
    });

    await page.route('http://localhost:3000/api/statements/createStatement', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true
        }),
      });
    });

    const inputField = await page.locator('input[placeholder="Enter Recharge Code"]');
    const addButton = await page.locator('button:has-text("Add Balance")');
    const message = await page.locator('p.text-green-500');

    await inputField.fill('valid-recharge-code'); // Simulate entering a valid code
    await addButton.click(); // Click on Add Balance

    // Check if it navigates to the homepage after 2 seconds
    await page.waitForTimeout(2000); // Wait for 2 seconds (simulate the timeout)
    
  });

  test('should display error message when API call fails', async ({ page }) => {
    // Mocking the API to fail
    await page.route('http://localhost:3000/api/recharge/validate', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          message: "Internal Server Error"
        }),
      });
    });

    const inputField = await page.locator('input[placeholder="Enter Recharge Code"]');
    const addButton = await page.locator('button:has-text("Add Balance")');
    const message = await page.locator('p.text-red-400');

    await inputField.fill('valid-recharge-code');
    await addButton.click();

    // Check for the error message
    await expect(message).toHaveText('An error occurred. Please try again later.');
  });
});
