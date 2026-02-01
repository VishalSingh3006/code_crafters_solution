// base.js - Playwright base fixture for retries and screenshot capture
import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(__dirname, '../../Screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR);
}

export const test = base.extend({
  // Add a hook to capture screenshot on failure and name it after the test
  page: async ({ page }, use, testInfo) => {
    await use(page);
    // if (testInfo.status === 'failed') {
    //   const screenshotName = `${testInfo.title.replace(/[^a-zA-Z0-9-_]/g, '_')}.png`;
    //   const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
    //   await page.screenshot({ path: screenshotPath, fullPage: true });
    // }
    let testName = testInfo.title.substring(0, 10);
    if (testInfo.retry) {
      testName += "_retry" + testInfo.retry + "_"
    }
    await page.screenshot({ path: './Screenshots/' + testName + '.png', fullPage: true });
  
  },
});

// Usage in spec.js:
// import { test, expect } from '../../fixture/base';
// test('your test', async ({ page }) => { ... });

// To enable retries, set in playwright.config.js:
// retries: 2
