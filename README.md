# Playwright Test Automation Portfolio

![Playwright Tests](https://github.com/ka7ku5-QA/playwrightdemo/actions/workflows/playwright.yml/badge.svg)

A demonstration of end-to-end test automation using **Playwright** and **TypeScript**, built while transitioning from 6.5+ years of commercial automation experience with **TestCafe**.

## About

This isn't a production test suite — it's a focused project to show recruiters and interviewers how I approach test automation: design, structure, and maintainability, now applied through Playwright rather than TestCafe.

The core engineering principles carry over regardless of framework:
- Maintainable, reusable test architecture
- Reliable assertions and validation strategies
- Data-driven testing
- Reduced duplication via Page Object Model
- Scalable project structure

The application under test is [SauceDemo](https://www.saucedemo.com/), a standard practice site for automation demos.

## Tech Stack

- **Framework:** Playwright
- **Language:** TypeScript (strong typing, interfaces, ES6+)
- **Runner:** Playwright Test (fixtures, parallel execution)
- **Pattern:** Page Object Model
- **CI:** GitHub Actions

## Project Structure

```
playwrightdemo/
├── tests/
│   └── saucedemo/          # UI test specs
├── pages/                  # Page object classes
├── .github/workflows/      # CI pipeline config
├── playwright.config.ts
├── package.json
└── README.md
```

## What's Covered

- Login (valid / invalid credentials)
- Product listing & sorting
- Cart operations
- Checkout flow

## Sample

Data-driven negative login scenarios, using a shared fixture and page object:

```typescript
const negativeLoginCases = [
  {
    name: 'incorrect credentials',
    credentials: users.incorrectCredentials.credentials,
    error: matchCredentialsError,
  },
  {
    name: 'locked out user',
    credentials: users.lockedOutUser.credentials,
    error: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    name: 'missing password',
    credentials: users.usernameOnly.credentials,
    error: 'Epic sadface: Password is required',
  },
  // ...plus missing-username, incorrect casing, and SQL-injection-style input cases
];

test.describe('Negative login scenarios', () => {
  for (const { name, credentials, error } of negativeLoginCases) {
    test(`Login fails when ${name}`, async ({ loginPage }) => {
      await loginPage.login(credentials);
      await loginPage.checkUrlLocation(`${config.baseUrl}`);
      await loginPage.checkUserIsOnLoginPage('Swag Labs');
      await loginPage.checkErrorMessage(error);
    });
  }
});
```

See [`tests/saucedemo/login.spec.ts`](./tests/saucedemo/login.spec.ts) for the full suite, including session persistence, direct-URL redirect, and keyboard-submission checks.

## Getting Started

```bash
git clone https://github.com/ka7ku5-QA/playwrightdemo.git
cd playwrightdemo
npm install
npx playwright install
```

## Running Tests

```bash
npx playwright test              # run all tests, headless
npx playwright test --headed     # run with browser UI visible
npx playwright test --ui         # run in Playwright's UI mode
npx playwright show-report       # view the last HTML report
```

## CI & Reports

Every push and pull request runs the full suite via GitHub Actions. The latest HTML report is published here:

**[View latest test report →](https://ka7ku5-qa.github.io/playwrightdemo/)**

## Roadmap

- [ ] REST API test coverage (auth, CRUD, schema validation)
- [ ] Cross-browser matrix (Chromium / Firefox / WebKit)

## Why Playwright

Strong browser support, speed, reliability, and first-class TypeScript support have made it one of the leading E2E frameworks — this project reflects the time I've invested applying my existing automation fundamentals to it.

## Contact

Happy to discuss the framework, my automation approach, or the TestCafe → Playwright transition — [https://www.linkedin.com/in/marc-cocklin-8324b088/] / [marc1157@hotmail.co.uk].
