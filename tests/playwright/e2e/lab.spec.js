import { test, expect } from '@playwright/test';

test.describe('Observability & Architecture Lab', () => {
  test('renders live lab metrics dashboard', async ({ page }) => {
    await page.goto('/lab');
    await page.waitForLoadState('domcontentloaded');

    // Check title and description
    await expect(page.locator('h1')).toContainText('Live Lab');
    await expect(page.locator('text=Real numbers from the real API')).toBeVisible();

    // Check panel sections
    await expect(page.locator('text=Dataset vs. fetched')).toBeVisible();
    await expect(page.locator('text=Controls')).toBeVisible();
  });

  test('executes latency race benchmark', async ({ page }) => {
    await page.goto('/lab');

    // Find and click "Run race" button
    const raceBtn = page.getByRole('button', { name: /Run race/i });
    if (await raceBtn.isVisible()) {
      await raceBtn.click();
      await page.waitForTimeout(2000);
      // Verify results or progress bars
      await expect(page.locator('text=Cached|Miss|Race').first()).toBeVisible();
    }
  });
});
