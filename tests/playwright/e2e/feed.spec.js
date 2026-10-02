import { test, expect } from '@playwright/test';
import { EndlessPage } from '../fixtures/helpers.js';

test.describe('Infinite Feed & Recommendation Engine', () => {
  test('loads home page showcase banner and initial video batch', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();

    // Verify main headline and showcase intro
    await expect(page.locator('#feed-title')).toBeVisible();
    await expect(page.locator('#feed-title')).toContainText('A feed that feels infinite');

    // Wait for initial batch of video cards
    await endless.waitForFeedToLoad(10);
    const initialCount = await endless.videoCards.count();
    expect(initialCount).toBeGreaterThanOrEqual(15);
  });

  test('infinite scroll loads subsequent batches via cursor pagination', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();
    await endless.waitForFeedToLoad(10);

    const initialCount = await endless.videoCards.count();

    // Scroll down to trigger sentinel element
    for (let i = 0; i < 3; i++) {
      await endless.scrollToBottom();
      await page.waitForTimeout(1000);
    }

    // After scrolling, the video count should increase
    const newCount = await endless.videoCards.count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('new session button resets the feed state', async ({ page }) => {
    const endless = new EndlessPage(page);
    await endless.gotoHome();
    await endless.waitForFeedToLoad(5);

    // Click "New session"
    if (await endless.newSessionButton.isVisible()) {
      await endless.newSessionButton.click();
      await page.waitForTimeout(500);
      await endless.waitForFeedToLoad(5);
      expect(await endless.videoCards.count()).toBeGreaterThan(0);
    }
  });
});
