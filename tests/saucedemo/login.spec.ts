import { test, expect } from './fixtures/fixture';
import { config } from './config';
import { users } from './data/users';


test.describe('Sauce Demo shop Login tests', () => {

  test('User with correct standard credentials can log in', async ({page, loginPage}) => {
    await loginPage.login(users.standardUser.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}/inventory.html`);
    await loginPage.checkHeadingVisibility({ headings: ['Products'], isVisible: true });
  })

  test('User with incorrect credentials cannot log in', async ({page, loginPage}) => {
    await loginPage.login(users.incorrectCredentials.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}`);
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
    await loginPage.checkErrorMessage('Epic sadface: Username and password do not match any user in this service')
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
  })

  test('displays inventory after succesful login', async ({ page, loginPage }) => {
    await loginPage.login(users.standardUser.credentials);
    await expect(page.getByText('Products')).toBeVisible();
    await loginPage.checkProductVisibility({
      products: [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)',
      ],
      isVisible: true,
    });
  });
});
