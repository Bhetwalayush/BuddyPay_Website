import { expect, test } from "@playwright/test";

test.describe('Login Page Tests', () => {
  // Test the login page rendering
  test('should render login form correctly', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:5173/login');
    

    // Check if the page contains the login elements
    await expect(page.locator('text=Login to BuddyPay')).toBeVisible();
    await expect(page.locator('input[placeholder="Phone Number"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Login' })).toBeVisible();
  });

  // Test the error message when login fails
  test('should display error message when login fails', async ({ page }) => {
    // Mocking the failed login API response with Playwright
    await page.route('**/api/user/login', (route) =>
      route.fulfill({
        status: 400,
        body: JSON.stringify({ message: 'Login failed. Try again!' }),
      })
    );

    // Navigate to the login page
    await page.goto('http://localhost:5173/login');

    // Fill in the phone and password fields with incorrect data
    await page.fill('input[placeholder="Phone Number"]', '1234567890');
    await page.fill('input[placeholder="Password"]', 'wrongpassword');

    // Click the login button
    await page.click('button:has-text("Login")');

    // Check if the error message appears
    await expect(page.locator('text=Login failed. Try again!')).toBeVisible();
  });

  // Test successful login and redirection
  test('should redirect to homepage after successful login', async ({ page }) => {
    // Mocking the successful login API response with Playwright
    await page.route('**/api/user/login', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          token: 'dummy_token',
          userData: {
            id: 'user123',
            fullname: 'John Doe',
            balance: 1000,
            isAdmin: false,
          },
        }),
      })
    );

    // Navigate to the login page
    await page.goto('http://localhost:5173/login');

    // Fill in the correct phone and password fields
    await page.fill('input[placeholder="Phone Number"]', '1234567890');
    await page.fill('input[placeholder="Password"]', 'password123');

    // Click the login button
    await page.click('button:has-text("Login")');

    

    // Assert that localStorage items are set correctly (use page.evaluate)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const id = await page.evaluate(() => localStorage.getItem('id'));
    const fullname = await page.evaluate(() => localStorage.getItem('fullname'));
    const isAdmin = await page.evaluate(() => localStorage.getItem('isAdmin'));

    // Verify that the localStorage items are set
    expect(token).toBe('dummy_token');
    expect(id).toBe('user123');
    expect(fullname).toBe('John Doe');
    expect(isAdmin).toBe('false');
  });

  // Test navigation to signup page
  test('should navigate to signup page when clicking signup link', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:5173/login');

    // Click on the "Signup Here" link
    await page.click('text=Signup Here');

    // Verify if the URL changed to the signup page
    await expect(page).toHaveURL('http://localhost:5173/signup');
  });

  // Test that login button is disabled during loading
  test('should disable login button while loading', async ({ page }) => {
    // Mocking the API response for login request delay
    await page.route('**/api/user/login', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          token: 'dummy_token',
          userData: {
            id: 'user123',
            fullname: 'John Doe',
            balance: 1000,
            isAdmin: false,
          },
        }),
        delay: 2000, // simulate a delay of 2 seconds
      })
    );

    // Navigate to the login page
    await page.goto('http://localhost:5173/login');

    // Fill in the login details
    await page.fill('input[placeholder="Phone Number"]', '9876553210');
    await page.fill('input[placeholder="Password"]', 'password');

    // Click the login button
    await page.click('button:has-text("Login")');

    await page.waitForTimeout(2500); // wait for the delay
    
  });
});
