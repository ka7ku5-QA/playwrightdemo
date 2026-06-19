import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { config } from '../config'

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(config.baseUrl);
    await use(loginPage);
  },
});

export { expect };