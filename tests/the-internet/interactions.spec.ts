import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com';

test.describe('Checkboxes', () => {
  test('can check and uncheck boxes', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkboxes`);

    const firstCheckbox = page.getByRole('checkbox').first();
    const secondCheckbox = page.getByRole('checkbox').nth(1);

    await expect(firstCheckbox).not.toBeChecked();
    await expect(secondCheckbox).toBeChecked();

    await firstCheckbox.check();
    await secondCheckbox.uncheck();

    await expect(firstCheckbox).toBeChecked();
    await expect(secondCheckbox).not.toBeChecked();
  });
});

test.describe('Dropdown', () => {
  test('can select an option', async ({ page }) => {
    await page.goto(`${BASE_URL}/dropdown`);

    await page.locator('#dropdown').selectOption('2');

    await expect(page.locator('#dropdown')).toHaveValue('2');
  });
});

test.describe('Dynamic content', () => {
  test('waits for content to appear after click', async ({ page }) => {
    await page.goto(`${BASE_URL}/dynamic_loading/1`);

    await page.getByRole('button', { name: 'Start' }).click();

    await expect(page.locator('#finish')).toHaveText('Hello World!');
  });
});
