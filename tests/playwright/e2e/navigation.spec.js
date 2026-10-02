import { test, expect } from '@playwright/test';
import { EndlessPage } from '../fixtures/helpers.js';

test.describe('Global Navigation, Categories & Search', () => {
  test('navigates to Trending feed via sidebar', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/trending"]');
    await page.waitForURL(/\/trending/);

    await expect(page.locator('h1')).toContainText(/Trending/i);
    await expect(page.locator('article, .video-row, a[href^="/watch/"]').first()).toBeVisible();
  });

  test('navigates to Explore catalog', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/explore"]');
    await page.waitForURL(/\/explore/);

    await expect(page.locator('h1')).toContainText(/Explore/i);
    // Categories should be listed
    await expect(page.locator('a[href^="/category/"]').first()).toBeVisible();
  });

  test('filters videos by category', async ({ page }) => {
    await page.goto('/category/Gaming');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toContainText('Gaming');
    await page.locator('article').first().waitFor({ state: 'visible' });
    expect(await page.locator('article').count()).toBeGreaterThan(0);
  });

  test('performs catalog search query', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();

    // Perform search
    await endless.searchFor('Tech');

    await expect(page.locator('h1, h2').first()).toContainText(/Tech/i);
    await page.locator('article, .video-row, a[href^="/watch/"]').first().waitFor({ state: 'visible' });
  });

  test('handles 404 not found route gracefully', async ({ page }) => {
    await page.goto('/some-nonexistent-route-12345');
    await expect(page.locator('text=/not found|404|Page not found/i').first()).toBeVisible();
  });
});
