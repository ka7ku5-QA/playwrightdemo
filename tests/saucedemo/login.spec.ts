import { test } from './fixtures/fixture';
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
      test(`log in as ${name}: expect to see products page`, async ({ loginPage }) => {
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
      test(`log in with ${name}: expect login to fail with error message`, async ({ loginPage }) => {
        await loginPage.login(credentials);
        await loginPage.checkUrlLocation(`${config.baseUrl}`);
        await loginPage.checkUserIsOnLoginPage('Swag Labs');
        await loginPage.checkErrorMessage(error);
      });
    }
  });

  test.describe('UI behavior', () => {
    test('view password field: expect input to be masked', async ({ loginPage }) => {
      await loginPage.checkPasswordIsMasked();
    });

    test('correct credentials after failed login attempt: expect successful login', async ({ loginPage }) => {
      await loginPage.login(users.incorrectCredentials.credentials);
      await loginPage.checkErrorMessage(
        matchCredentialsError
      );
      await loginPage.login(users.standardUser.credentials);
      await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    });
  })

  test.describe('Session and navigation', () => {
    test('navigate to inventory page while unauthenticated: expect redirect to login page', async ({ loginPage }) => {
      await loginPage.goToURL(`${config.baseUrl}/inventory.html`);
      await loginPage.checkUserIsOnLoginPage('Swag Labs');
    });

    test('refresh page after logging in: expect session to persist', async ({ loginPage }) => {
      await loginPage.login(users.standardUser.credentials);
      await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
      await loginPage.reloadPage();
      await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    });

    test('submit login form with Enter key: expect successful login', async ({ loginPage }) => {
      await loginPage.loginWithEnterKey(users.standardUser.credentials);
      await loginPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    });
  });
});