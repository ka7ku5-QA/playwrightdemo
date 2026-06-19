import { test, expect } from './fixtures/fixture';
import { config } from './config';
import { users } from './data/users';


test.describe('Sauce Demo shop Login tests', () => {

  test('User with correct standard credentials can log in: Expect to see products page', async ({page, loginPage}) => {
    await loginPage.login(users.standardUser.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}/inventory.html`);
    await loginPage.checkHeadingVisibility({ headings: ['Products'], isVisible: true });
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
  })

  test('User with logs in with incorrect credentials: Expect user cannot log in + error', async ({page, loginPage}) => {
    await loginPage.login(users.incorrectCredentials.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}`);
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
    await loginPage.checkErrorMessage('Epic sadface: Username and password do not match any user in this service')
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
  })

  test('User leaves fields blank and tries to login: Expect not to be able to login + error', async ({page, loginPage}) => {
    await loginPage.login(users.noCredentials.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}`);
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
    await loginPage.checkErrorMessage('Epic sadface: Username is required')
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
  })

  test('User tries to login with locked_out_user: Expect not to be able to login + error', async ({page, loginPage}) => {
    await loginPage.login(users.lockedOutUser.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}`);
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
    await loginPage.checkErrorMessage('Epic sadface: Sorry, this user has been locked out.')
    await loginPage.checkUserIsOnLoginPage('Swag Labs')
  })

});
