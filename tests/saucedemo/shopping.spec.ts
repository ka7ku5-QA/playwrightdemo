import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('Sauce Demo shop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('displays inventory after login', async ({ page }) => {
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('adds item to cart and completes checkout', async ({ page }) => {
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
