import { page, expect } from "@playwright/test";
import Utilities from "../utils/utilities";

let selectors = {
  eMailTxtField: '[name="email"]',
  passwordTxtField: '[name="password"]',
  loginButton: '#sign-in-btn',
  
  forgotPswLink: '[href="/forgot-password"]',
  registerLink: '[href="/register"]',
  forgotEmailTxtField: '[type="email"]',
  forgotPswSubmitBtn: '[type="submit"]'
};

class LoginPage extends Utilities {
  constructor(page) {
    super(page);
  }

  async login(username, password) {
    const element1 = await this.page.locator(selectors.eMailTxtField);
    await element1.fill(username);
    const element2 = await this.page.locator(selectors.passwordTxtField);
    await element2.fill(password);
    await this.page.click(selectors.loginButton);
  }

  // Button assertion methods
  async verifyLoginButtonText(expectedText = 'Login') {
    const loginButton = this.page.locator(selectors.loginButton);
    await expect(loginButton).toHaveText(expectedText);
  }

  async verifyLoginButtonEnabled() {
    const loginButton = this.page.locator(selectors.loginButton);
    await expect(loginButton).toBeEnabled();
  }

  async verifyLoginButtonVisible() {
    const loginButton = this.page.locator(selectors.loginButton);
    await expect(loginButton).toBeVisible();
  }

  async getLoginButtonText() {
    const loginButton = this.page.locator(selectors.loginButton);
    return await loginButton.innerText();
  }

  async forgotPassword() {
    await this.page.click(selectors.forgotPswLink);
    const emailField = await this.page.locator(selectors.forgotEmailTxtField);
    await emailField.fill('som.singh@sierradev.com');
    await this.page.click(selectors.forgotPswSubmitBtn);
  }

    async registerLink() {
    await this.page.click(selectors.registerLink);
    const emailField = await this.page.locator(selectors.eMailTxtField);
    await emailField.fill('som.singh@sierradev.com');
    await this.page.click(selectors.loginButton);
  }
}

export default LoginPage;

