import { page, expect } from "@playwright/test";
import Utilities from "../utils/utilities";

let selectors = {
    dashboardLink: '#dashboard-btn',
    viewProjectsBtn: '#view-projects-btn',
    viewEmployeesBtn: '#view-employees-btn',
    viewClientsBtn: '#view-clients-btn'
};

class DashboardPage extends Utilities {
  constructor(page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/path-to-dashboard'); // Update with actual path
    await this.page.waitForSelector(this.selectors.mainContainer);
  }

  async viewProjectButtonClick() {
    const viewProjectsBtn = this.page.locator(selectors.viewProjectsBtn);
    await this.page.click(selectors.viewProjectsBtn);
  }
  async getPageTitle() {
    await this.page.waitForSelector(this.selectors.headerTitle);
    return await this.page.locator(this.selectors.headerTitle).textContent();
  }

}

export default DashboardPage;

