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

  const negativeLoginCases = [
    {
      name: 'incorrect credentials',
      credentials: users.incorrectCredentials.credentials,
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      name: 'no credentials',
      credentials: users.noCredentials.credentials,
      error: 'Epic sadface: Username is required',
    },
    {
      name: 'locked out user',
      credentials: users.lockedOutUser.credentials,
      error: 'Epic sadface: Sorry, this user has been locked out.',
    },
  ];
  
  test.describe('Negative login scenarios', () => {
    for (const { name, credentials, error } of negativeLoginCases) {
      test(`Login fails when ${name}`, async ({ page, loginPage }) => {
        await loginPage.login(credentials);
        await expect(page).toHaveURL(`${config.baseUrl}`);
        await loginPage.checkUserIsOnLoginPage('Swag Labs');
        await loginPage.checkErrorMessage(error);
      });
    }
  });
});
