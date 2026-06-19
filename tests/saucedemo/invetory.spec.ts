import { test, expect } from '@playwright/test';
import { config } from './config';
import { LoginPage } from './pages/login';
import { users } from './data/users';




  test('adds item to cart and completes checkout', async ({ page }) => {
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(`${config.baseUrl}/cart.html`);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });