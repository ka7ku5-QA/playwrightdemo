import { test, expect } from './fixtures/fixture';
import { config } from './config';
import { users } from './data/users';

test.describe('Sauce Demo shop shopping tests', () => {
test.beforeEach(async ({page, loginPage}) => {
    await loginPage.login(users.standardUser.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}/inventory.html`);
  });

  test('adds item to cart and completes checkout', async ({ page, shoppingPage: shoppingPage }) => {
    await shoppingPage.addInventoryItemToCart('Sauce Labs Backpack'); 
    await shoppingPage.checkItemsInCart(1);
    await shoppingPage.clickButton('Checkout');
    await shoppingPage.fillUserDetails(users.standardUser);
    await shoppingPage.clickButton('Continue');
    await shoppingPage.clickButton('Finish');
    await shoppingPage.checkConfirmationMessage('Thank you for your order!')
  })});