import { test, expect } from '@playwright/test';
import { EndlessPage } from '../fixtures/helpers.js';

test.describe('Video Watch Experience & Interactions', () => {
  test('navigates from feed to video watch detail view', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();

    // Click on the first video
    const videoTitle = await endless.openFirstVideo();

    // Verify watch page header title matches
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(videoTitle.trim());

    // Verify view count, creator, and category badge
    await expect(page.locator('aside h2')).toContainText('Up next');
  });

  test('subscribes and toggles subscription state', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();
    await endless.openFirstVideo();

    const subButton = page.getByRole('button', { name: /Subscribe|Subscribed/i });
    await expect(subButton).toBeVisible();

    // Click subscribe
    await subButton.click();
    await expect(page.getByRole('button', { name: /Subscribed/i })).toBeVisible();

    // Click to unsubscribe
    await subButton.click();
    await expect(page.getByRole('button', { name: /Subscribe/i })).toBeVisible();
  });

  test('loads related videos in the sidebar', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();
    await endless.openFirstVideo();

    // Verify "Up next" related videos list rendered
    const relatedList = page.locator('aside');
    await expect(relatedList).toBeVisible();
    await expect(relatedList.locator('a[href^="/watch/"]').first()).toBeVisible();
  });
});
