import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com';

test.describe('Login form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('shows error with invalid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill('wronguser');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/secure`);
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });
});
