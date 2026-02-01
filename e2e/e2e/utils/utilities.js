const { expect } = require("@playwright/test");

module.exports = class Utilities {
  constructor(page, context) {
    this.page = page
    this.context = context
  }

  /**
   * Scroll a container (or window) until item count stops increasing or sentinel appears.
   * @param {Object} opts
   * @param {string} opts.itemSelector CSS selector for each loaded item (required).
   * @param {string} [opts.containerSelector='body'] Scrollable container selector or 'body'.
   * @param {string|null} [opts.sentinelSelector=null] Selector that appears when all items loaded.
   * @param {number} [opts.pauseMs=350] Delay between scroll attempts.
   * @param {number} [opts.maxIterations=80] Safety cap to avoid infinite loops.
   * @param {number} [opts.stableThreshold=3] How many consecutive iterations with no growth to consider complete.
   * @returns {Promise<number>} Final count of items.
   */
  async loadAllLazyItems({
    itemSelector,
    containerSelector = 'body',
    sentinelSelector = null,
    pauseMs = 350,
    maxIterations = 80,
    stableThreshold = 3,
  }) {
    if (!itemSelector) throw new Error('itemSelector is required');
    await this.page.waitForSelector(itemSelector);

    let prevCount = 0;
    let stable = 0;

    for (let i = 0; i < maxIterations; i++) {
      if (sentinelSelector) {
        const sentinelVisible = await this.page.locator(sentinelSelector).first().isVisible().catch(() => false);
        if (sentinelVisible) break;
      }

      const currentCount = await this.page.locator(itemSelector).count();
      if (currentCount === prevCount) {
        stable++;
        if (stable >= stableThreshold) break;
      } else {
        stable = 0;
        prevCount = currentCount;
      }

      await this.page.evaluate(selector => {
        const el = selector === 'body' ? document.scrollingElement || document.body : document.querySelector(selector);
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
      }, containerSelector);

      await this.page.waitForTimeout(pauseMs);
    }

    return await this.page.locator(itemSelector).count();
  }
}
