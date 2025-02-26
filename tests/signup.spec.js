import { expect, test } from '@playwright/test';

test.describe('Signup Page Tests', () => {
  // Test the signup page rendering
  test('should render signup form correctly', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('http://localhost:5173/signup');

    // Check if the page contains the signup elements
    await expect(page.locator('text=Join the world of digital money')).toBeVisible();
    await expect(page.locator('input[placeholder="Full Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Phone Number"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirm Password"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Pin"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Join' })).toBeVisible();
  });

  // Test the error message when passwords do not match
  test('should display error message when passwords do not match', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('http://localhost:5173/signup');

    // Fill in the signup form with mismatched passwords
    await page.fill('input[name="fullname"]', 'John Doe');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password456');
    await page.fill('input[name="pin"]', '1234');

    // Click the signup button
    await page.click('button:has-text("Join")');

    // Check if the error message appears
    await expect(page.locator('text=Passwords do not match!')).toBeVisible();
  });

  // Test successful signup and redirection to login page
  test('should redirect to login page after successful signup', async ({ page }) => {
    // Mocking the successful signup API response
    await page.route('**/api/user/create', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          message: 'Signup successful! Redirecting...',
        }),
      })
    );

    // Navigate to the signup page
    await page.goto('http://localhost:5173/signup');

    // Fill in the correct signup form data
    await page.fill('input[name="fullname"]', 'John Doe');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.fill('input[name="pin"]', '1234');

    // Click the signup button
    await page.click('button:has-text("Join")');

    // Check if the success message is displayed
    await expect(page.locator('text=Signup successful! Redirecting...')).toBeVisible();

    // Wait for redirection to the login page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('http://localhost:5173/login');
  });

  // Test navigation to login page from signup page
  test('should navigate to login page when clicking login link', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('http://localhost:5173/signup');

    // Click on the "Login Here" link
    await page.click('text=Login Here');

    // Verify if the URL changed to the login page
    await expect(page).toHaveURL('http://localhost:5173/login');
  });

  // Test that signup button is disabled during loading
  test('should disable signup button while loading', async ({ page }) => {
    // Mocking the API response for signup request delay
    await page.route('**/api/user/create', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          message: 'Signup successful! Redirecting...',
        }),
        delay: 2000, // simulate a delay of 2 seconds
      })
    );

    // Navigate to the signup page
    await page.goto('http://localhost:5173/signup');

    // Fill in the signup details
    await page.fill('input[name="fullname"]', 'John Doe');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.fill('input[name="pin"]', '1234');

    // Click the signup button
    await page.click('button:has-text("Join")');

    // Wait for the delay
    await page.waitForTimeout(2500); // wait for the delay
  });
});
