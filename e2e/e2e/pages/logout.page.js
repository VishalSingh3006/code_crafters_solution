import { page } from "@playwright/test";

let selectors = {
  logoutButton: '#logout-btn'
}; 

class LogoutPage {
  constructor(page) {
    this.page = page;
  }
  async logout() {
    await this.page.click(selectors.logoutButton);
  }
  async successfulLogout() {
    await this.page.waitForURL('**/login');
  }
}

export default LogoutPage;