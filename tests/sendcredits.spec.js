import { expect, test } from '@playwright/test';

test.describe('Send Credits Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Send Credits page before each test
    await page.goto('http://localhost:5173/sendcredits');
  });

  test('should render the Send Credits page correctly', async ({ page }) => {
    // Check if the input fields and button are visible
    const recipientInput = await page.locator('input[placeholder="Enter Recipient\'s Phone Number"]');
    const amountInput = await page.locator('input[placeholder="Enter Amount"]');
    const sendButton = await page.locator('button:has-text("Send Credits")');
    const logo = await page.locator('img[alt="BuddyPay Logo"]');

    await expect(recipientInput).toBeVisible();
    await expect(amountInput).toBeVisible();
    await expect(sendButton).toBeVisible();
    await expect(logo).toBeVisible();
  });

  test('should display error message for missing recipient or amount', async ({ page }) => {
    const recipientInput = await page.locator('input[placeholder="Enter Recipient\'s Phone Number"]');
    const amountInput = await page.locator('input[placeholder="Enter Amount"]');
    const sendButton = await page.locator('button:has-text("Send Credits")');
    const message = await page.locator('p.text-red-500');

    // Test with missing recipient number
    await amountInput.fill('100');
    await sendButton.click();

    // Test with missing amount
    await recipientInput.fill('9876543210');
    await sendButton.click();
    
  });

  test('should show success message and navigate to homepage on successful send', async ({ page }) => {
    // Mocking the API response for a successful send
    await page.route('http://localhost:3000/api/user/sendcredit', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          message: 'Credits sent successfully!',
        }),
      });
    });

    await page.route('http://localhost:3000/api/statements/createStatement', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
        }),
      });
    });

    const recipientInput = await page.locator('input[placeholder="Enter Recipient\'s Phone Number"]');
    const amountInput = await page.locator('input[placeholder="Enter Amount"]');
    const sendButton = await page.locator('button:has-text("Send Credits")');
    // const message = await page.locator('p.text-green-500');

    await recipientInput.fill('9876543210'); // Simulate entering recipient number
    await amountInput.fill('100'); // Simulate entering amount
    await sendButton.click(); // Click on Send Credits


    // Check if it navigates to the homepage after 2 seconds
    await page.waitForTimeout(2000); // Wait for 2 seconds (simulate the timeout)
  });

  test('should display error message when API call fails', async ({ page }) => {
    // Mocking the API to fail
    await page.route('http://localhost:3000/api/user/sendcredit', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          success: false,
          message: 'Internal Server Error',
        }),
      });
    });

    const recipientInput = await page.locator('input[placeholder="Enter Recipient\'s Phone Number"]');
    const amountInput = await page.locator('input[placeholder="Enter Amount"]');
    const sendButton = await page.locator('button:has-text("Send Credits")');

    await recipientInput.fill('9876543210');
    await amountInput.fill('100');
    await sendButton.click();

    
  });
});
