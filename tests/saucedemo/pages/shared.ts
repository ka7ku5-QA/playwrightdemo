import { Page, expect } from '@playwright/test';
import { Credentials } from '../credentials';


export class SharedPage {
    constructor(protected readonly page: Page) {}

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

async checkUrlLocation(url: string | RegExp){
    await expect(this.page).toHaveURL(url);
  }

  async reloadPage() {
    await this.page.reload();
  }

  async goToURL(url: string) {
    await this.page.goto(url)
  } 
}