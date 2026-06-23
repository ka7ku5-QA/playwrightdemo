import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { ShoppingPage } from '../pages/shopping'
import { config } from '../config'

type MyFixtures = {
  loginPage: LoginPage;
  shoppingPage: ShoppingPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(config.baseUrl);
    await use(loginPage);
  },
  shoppingPage: async ({ page }, use) => {
      const shoppingPage = new ShoppingPage(page);
      await use(shoppingPage);
    },
});


export { expect };