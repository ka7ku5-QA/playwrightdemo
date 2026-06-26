import { test, expect } from './fixtures/fixture';
import { config } from './config';
import { users } from './data/users';
import { INVENTORY_PRODUCTS } from './helpers/productData';


const selectedItem = 'Sauce Labs Backpack'
const multipleItems = ['Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket']

test.describe('Sauce Demo shop shopping tests', () => {

test.beforeEach(async ({page, loginPage}) => {
    await loginPage.login(users.standardUser.credentials);
    await expect(page).toHaveURL(`${config.baseUrl}/inventory.html`);
  });


  test('inventory contains expected products: expect 6 products', async ({shoppingPage: shoppingPage }) => {
    await shoppingPage.checkProductsDisplayed(INVENTORY_PRODUCTS);
  });

  test('add item to cart, then remove: expect cart to reflect item number', async ({shoppingPage: shoppingPage }) => {
    await shoppingPage.addInventoryItemToCart('Sauce Labs Onesie');
    await shoppingPage.checkCartBadgeCount(1); 
    await shoppingPage.removeItemFromInventory('Sauce Labs Onesie');
    await shoppingPage.checkCartBadgeCount(0);
  });

  test('add multiple items to cart, then remove and re-add: expect cart to reflect item number', async ({shoppingPage: shoppingPage }) => {
    await shoppingPage.addMultipleInventoryItemsToCart(multipleItems);
    await shoppingPage.checkCartBadgeCount(3);
    await shoppingPage.removeItemFromInventory('Sauce Labs Bolt T-Shirt');
    await shoppingPage.checkCartBadgeCount(2);
    await shoppingPage.addMultipleInventoryItemsToCart(['Sauce Labs Onesie', 'Test.allTheThings() T-Shirt (Red)']);
    await shoppingPage.checkCartBadgeCount(4);
  });

  test('add 1 item to cart and complete checkout: expect successful order', async ({shoppingPage: shoppingPage }) => {
    await shoppingPage.addInventoryItemToCart(selectedItem);
    await shoppingPage.checkCartBadgeCount(1);
    await shoppingPage.checkItemsInCart(1);
    await shoppingPage.clickButton('Checkout');
    await shoppingPage.fillUserDetails(users.standardUser);
    await shoppingPage.clickButton('Continue');
    await shoppingPage.clickButton('Finish');
    await shoppingPage.checkConfirmationMessage('Thank you for your order!', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });

  test('add all items to cart and complete checkout: expect successful order', async ({shoppingPage: shoppingPage }) => {
    await shoppingPage.addMultipleInventoryItemsToCart(INVENTORY_PRODUCTS); 
    await shoppingPage.checkCartBadgeCount(6);
    await shoppingPage.checkItemsInCart(6);
    await shoppingPage.clickButton('Checkout');
    await shoppingPage.fillUserDetails(users.standardUser);
    await shoppingPage.clickButton('Continue');
    await shoppingPage.clickButton('Finish');
    await shoppingPage.checkConfirmationMessage('Thank you for your order!', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  })

  test('add item to cart, go to cart and remove item: expect cart to be empty', async ({shoppingPage: shoppingPage }) => {

    await shoppingPage.addInventoryItemToCart(selectedItem);
    await shoppingPage.checkCartBadgeCount(1);
    await shoppingPage.checkItemsInCart(1);
    await shoppingPage.checkCartContainsItem(selectedItem)
    await shoppingPage.removeItemFromCartPage(selectedItem);
    await shoppingPage.checkCartIsEmpty();
  });

  test('add multiple items to cart, go to cart and remove items: expect cart to be empty', async ({shoppingPage: shoppingPage }) => {
    
    await shoppingPage.addMultipleInventoryItemsToCart(multipleItems);
    await shoppingPage.checkCartBadgeCount(3);
    await shoppingPage.checkItemsInCart(3);
    await shoppingPage.checkCartContainsMultipleItems(multipleItems);
    await shoppingPage.removeMultipleItemsFromCartPage(multipleItems);
    await shoppingPage.checkCartIsEmpty();
  });
});