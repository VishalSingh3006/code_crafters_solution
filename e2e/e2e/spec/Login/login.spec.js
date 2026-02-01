// @ts-check
import { expect } from '@playwright/test';
import { test } from '@playwright/test';
// Ensure the correct path to testData.json; adjust if needed
const loginData = JSON.parse(JSON.stringify(require('../../resources/testData.json')));
import LoginPage from '../../pages/login.page';
import LogoutPage from '../../pages/logout.page';


test('Login to RMT', async ({ page, context }) => {
  
  
  await page.goto(loginData.url);

  const loginPage = new LoginPage(page);
  
  // Using LoginPage methods for assertions
  // await loginPage.verifyLoginButtonVisible();
  // await loginPage.verifyLoginButtonEnabled();
  await loginPage.verifyLoginButtonText('Sign In');
  test.setTimeout(100000);
  await loginPage.login(loginData.username, loginData.password);

  // const logoutPage = new LogoutPage(page);
  // await logoutPage.logout();
  // await logoutPage.successfulLogout();
});

test('Sign In Button Assertions', async ({ page }) => {
  test.setTimeout(100000);
  
  await page.goto(loginData.url);
  
  const loginButton = page.locator('[type="submit"]');
  
  // 1. Exact text match
  await expect(loginButton).toHaveText('Sign In');
  
  // 2. Contains text (partial match)
  await expect(loginButton).toContainText('Sign In');
  
  // 3. Using different selector approaches
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  // await expect(page.getByText('Sign In')).toBeVisible();
  
  // 4. Assert button attributes
  await expect(loginButton).toHaveAttribute('type', 'submit');
  
  // 5. Assert button is enabled
  await expect(loginButton).toBeEnabled();
  
  // 6. Assert button inner text (alternative to toHaveText)
  const buttonText = await loginButton.innerText();
  expect(buttonText).toBe('Sign In');
  
  // 7. Case-insensitive text assertion
  await expect(loginButton).toHaveText(/sign in/i);
});

test('Forgot Password', async ({ page, context }) => {
  test.setTimeout(100000);
  await page.goto(loginData.url);

  const loginPage = new LoginPage(page);
  await loginPage.forgotPassword();

});