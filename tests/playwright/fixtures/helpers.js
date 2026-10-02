/**
 * Reusable Page Object Helpers for Endless Playwright tests
 */
export class EndlessPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input[aria-label="Search videos"]');
    this.searchForm = page.locator('form[role="search"]');
    this.videoCards = page.locator('article');
    this.categoryLinks = page.locator('a[href^="/category/"]');
    this.signInButton = page.locator('#topbar-signin-btn');
    this.newSessionButton = page.getByRole('button', { name: /New session/i });
  }

  async gotoHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForFeedToLoad(minCards = 1) {
    await this.page.locator('article').first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.videoCards.count();
    return count >= minCards;
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
    await this.searchForm.press('Enter');
    await this.page.waitForURL(new RegExp(`/search\\?q=${encodeURIComponent(query)}`));
  }

  async openFirstVideo() {
    await this.waitForFeedToLoad();
    const firstCard = this.videoCards.first();
    const videoTitle = await firstCard.locator('h3').innerText();
    await firstCard.locator('a').first().click();
    await this.page.waitForURL(/\/watch\/\d+/);
    return videoTitle;
  }
}
