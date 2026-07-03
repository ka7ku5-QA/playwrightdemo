import { test, expect } from './fixtures/fixture';
import { config } from './config';
import { users } from './data/users';

const matchCredentialsError = 'Epic sadface: Username and password do not match any user in this service'

test.describe('Sauce Demo shop Login tests', () => {
  
  const positiveLoginCases = [
    {
      name: 'standard user',
      credentials: users.standardUser.credentials,
    },
    {
      name: 'problem user',
      credentials: users.problemUser.credentials,
    },
  ];

  test.describe('Positive login scenarios', () => {
    for (const { name, credentials } of positiveLoginCases) {
      test(`User ${name} can successfully log in: Expect to see products page`, async ({ page, loginPage }) => {
        await loginPage.login(credentials);
        await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
        await loginPage.checkHeadingVisibility({ headings: ['Products'], isVisible: true });
      });
    }
  });

  const negativeLoginCases = [
    {
      name: 'incorrect credentials',
      credentials: users.incorrectCredentials.credentials,
      error: matchCredentialsError
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
    {
      name: 'missing username',
      credentials: users.passwordOnly.credentials,
      error: 'Epic sadface: Username is required',
    },
    {
      name: 'missing password',
      credentials: users.usernameOnly.credentials,
      error: 'Epic sadface: Password is required',
    },
    {
      name: 'SQL-injection-style input',
      credentials: users.sqlInjectionCredentials.credentials,
      error: matchCredentialsError
    },
    {
      name: 'incorrect username casing',
      credentials: users.wrongCaseCredentials.credentials,
      error: matchCredentialsError
    },
  ];
  
  test.describe('Negative login scenarios', () => {
    for (const { name, credentials, error } of negativeLoginCases) {
      test(`Login fails when ${name}`, async ({ page, loginPage }) => {
        await loginPage.login(credentials);
        await loginPage.checkUrlLocation(`${config.baseUrl}`);
        await loginPage.checkUserIsOnLoginPage('Swag Labs');
        await loginPage.checkErrorMessage(error);
      });
    }
  });

  test.describe('UI behavior', () => {
    test('Password field masks input', async ({ loginPage }) => {
      await loginPage.checkPasswordIsMasked();
    });

    test('Error message updates after correcting credentials and retrying', async ({ loginPage }) => {
      await loginPage.login(users.incorrectCredentials.credentials);
      await loginPage.checkErrorMessage(
        matchCredentialsError
      );
      await loginPage.login(users.standardUser.credentials);
      await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    });
})

test.describe('Session and navigation', () => {
  test('Unauthenticated user hitting inventory directly is redirected to login', async ({ loginPage }) => {
    await loginPage.goToURL(`${config.baseUrl}/inventory.html`);
    await loginPage.checkUserIsOnLoginPage('Swag Labs');
  });

  test('Session persists after page refresh', async ({ loginPage }) => {
    await loginPage.login(users.standardUser.credentials);
    await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    await loginPage.reloadPage();
    await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
  });

  test('Enter key submits the login form', async ({ page, loginPage }) => {
    await loginPage.loginWithEnterKey(users.standardUser.credentials);
    await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
  });
});
});
