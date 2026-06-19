import { Page, expect } from '@playwright/test';
import { Credentials } from '../credentials';

type CheckHeadingVisibilityArgs = {
  headings: string[];
  isVisible: boolean;
};

type CheckProductVisibilityArgs = {
  products: string[];
  isVisible: boolean;
};

export class LoginPage {
    constructor(private readonly page: Page) {}
  
    get username() {
      return this.page.getByPlaceholder('Username');
    }
  
    get password() {
      return this.page.getByPlaceholder('Password');
    }
  
    get loginButton() {
      return this.page.getByRole('button', { name: 'Login' });
    }
  
  async login(credentials: Credentials) {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
    await this.loginButton.click();
  }

  async checkHeadingVisibility({
    headings,
    isVisible,
  }: CheckHeadingVisibilityArgs) {
    for (const heading of headings) {
      const visibleHeading = this.page.getByText(heading);

      if (isVisible) {
        await expect(visibleHeading).toBeVisible();
      } else {
        await expect(visibleHeading).not.toBeVisible();
      }
    }
  }

  async checkProductVisibility({
    products,
    isVisible,
  }: CheckProductVisibilityArgs) {
    
    await expect(this.page.locator('.inventory_item')).toHaveCount(6);
    for (const product of products) {
      const actualProducts = await this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  
    expect(actualProducts).toEqual(products);
  }
  }

  async checkUserIsOnLoginPage(headingText: string) {
    await expect(
      this.page.locator('.login_logo')
    ).toHaveText(headingText);
    await expect(this.page.locator('[data-test="login-container"]').isVisible)
  }


  async checkErrorMessage(errorMessage: string){
    await expect(this.page.locator('[data-test="error"]'))
  .toHaveText(errorMessage);
  }
}