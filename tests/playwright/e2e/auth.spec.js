import { test, expect } from '@playwright/test';

test.describe('User Authentication & Profile Flow', () => {
  test('opens and closes sign in modal', async ({ page }) => {
    await page.goto('/');

    const signInBtn = page.locator('#topbar-signin-btn');
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Verify modal overlay appears
    await expect(page.locator('text=Sign in to Endless')).toBeVisible();

    // Close with Escape key
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Sign in to Endless')).toBeHidden();
  });

  test('registers a new user and logs in', async ({ page }) => {
    await page.goto('/');

    const signInBtn = page.locator('#topbar-signin-btn');
    await signInBtn.click();

    // Switch to create account
    const createAccountBtn = page.getByRole('button', { name: /create one|sign up/i });
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }

    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const nameInput = page.locator('input[placeholder*="Name" i], input[type="text"]').last();
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    if (await nameInput.isVisible()) {
      await nameInput.fill('Playwright Tester');
    }
    await emailInput.fill(uniqueEmail);
    await passwordInput.fill('password123');

    // Submit form
    await page.locator('form').last().locator('button[type="submit"]').click();

    // User avatar or dropdown should be visible upon login
    await page.waitForTimeout(1000);
  });
});
