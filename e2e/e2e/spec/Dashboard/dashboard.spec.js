// @ts-check
import { test } from '../../fixture/base';
import { expect } from '@playwright/test';
import DashboardPage from '../../pages/dashboard.page';

// Load test data
const testData = JSON.parse(JSON.stringify(require('../../resources/testData.json')));

test.describe('Dashboard Page Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Set timeout for each test
    test.setTimeout(60000);

    // Navigate to application
    await page.goto(testData.url);

    // Add any common setup steps here (e.g., login)
    // const loginPage = new LoginPage(page);
    // await loginPage.login(testData.username, testData.password);
  });

  test('Dashboard - Page Load and Navigation', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Navigate to the page
    await dashboardPage.navigate();

    // Assert page title
    const pageTitle = await dashboardPage.getPageTitle();
    expect(pageTitle).toContain('Dashboard'); // Update expected text
  });

});