import { test } from './fixtures/fixture';
import { config } from './config';
import { users } from './data/users';
import { INVENTORY_PRODUCTS } from './helpers/productData';


test.describe('Sauce Demo shop shopping tests', () => {
  const selectedItem = 'Sauce Labs Backpack'
  const multipleItems = ['Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket']
  const { firstName, lastName, zipCode } = users.standardUser.account;

  test.beforeEach(async ({ shoppingPage }) => {
    await shoppingPage.login(users.standardUser.credentials);
    await shoppingPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
  });


  test('inventory contains expected products: expect 6 products', async ({ shoppingPage }) => {
    await shoppingPage.checkProductsDisplayed(INVENTORY_PRODUCTS);
  });

  test('add item to cart, then remove: expect cart to reflect item number', async ({ shoppingPage }) => {
    await shoppingPage.addInventoryItemToCart('Sauce Labs Onesie');
    await shoppingPage.checkCartBadgeCount(1);
    await shoppingPage.removeItemFromInventory('Sauce Labs Onesie');
    await shoppingPage.checkCartBadgeCount(0);
  });

  test('add multiple items to cart, then remove and re-add: expect cart to reflect item number', async ({ shoppingPage }) => {
    await shoppingPage.addMultipleInventoryItemsToCart(multipleItems);
    await shoppingPage.checkCartBadgeCount(3);
    await shoppingPage.removeItemFromInventory('Sauce Labs Bolt T-Shirt');
    await shoppingPage.checkCartBadgeCount(2);
    await shoppingPage.addMultipleInventoryItemsToCart(['Sauce Labs Onesie', 'Test.allTheThings() T-Shirt (Red)']);
    await shoppingPage.checkCartBadgeCount(4);
  });

  test('add 1 item to cart and complete checkout: expect successful order', async ({ shoppingPage }) => {
    await shoppingPage.addInventoryItemToCart(selectedItem);
    await shoppingPage.checkCartBadgeCount(1);
    await shoppingPage.checkItemsInCart(1);
    await shoppingPage.clickButton('Checkout');
    await shoppingPage.fillUserDetails(firstName, lastName, zipCode);
    await shoppingPage.clickButton('Continue');
    await shoppingPage.clickButton('Finish');
    await shoppingPage.checkConfirmationMessage('Thank you for your order!', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });

  test('add all items to cart and complete checkout: expect successful order', async ({ shoppingPage }) => {
    await shoppingPage.addMultipleInventoryItemsToCart(INVENTORY_PRODUCTS);
    await shoppingPage.checkCartBadgeCount(6);
    await shoppingPage.checkItemsInCart(6);
    await shoppingPage.clickButton('Checkout');
    await shoppingPage.fillUserDetails(firstName, lastName, zipCode);
    await shoppingPage.clickButton('Continue');
    await shoppingPage.clickButton('Finish');
    await shoppingPage.checkConfirmationMessage('Thank you for your order!', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  })

  test('add item to cart, go to cart and remove item: expect cart to be empty', async ({ shoppingPage }) => {
    await shoppingPage.addInventoryItemToCart(selectedItem);
    await shoppingPage.checkCartBadgeCount(1);
    await shoppingPage.checkItemsInCart(1);
    await shoppingPage.checkCartContainsItem(selectedItem)
    await shoppingPage.removeItemFromCartPage(selectedItem);
    await shoppingPage.checkCartIsEmpty();
  });

  test('add multiple items to cart, go to cart and remove items: expect cart to be empty', async ({ shoppingPage }) => {
    await shoppingPage.addMultipleInventoryItemsToCart(multipleItems);
    await shoppingPage.checkCartBadgeCount(3);
    await shoppingPage.checkItemsInCart(3);
    await shoppingPage.checkCartContainsMultipleItems(multipleItems);
    await shoppingPage.removeMultipleItemsFromCartPage(multipleItems);
    await shoppingPage.checkCartIsEmpty();
  });

  test.describe('Checkout form validation', () => {
    const checkoutValidationCases = [
      {
        name: 'missing first name',
        firstName: '',
        lastName: 'Doe',
        zip: '12345',
        error: 'Error: First Name is required',
      },
      {
        name: 'missing last name',
        firstName: 'John',
        lastName: '',
        zip: '12345',
        error: 'Error: Last Name is required',
      },
      {
        name: 'missing zip code',
        firstName: 'John',
        lastName: 'Doe',
        zip: '',
        error: 'Error: Postal Code is required',
      },
    ];

    for (const { name, firstName, lastName, zip, error } of checkoutValidationCases) {
      test(`Checkout fails when ${name}: expect error "${error}"`, async ({ shoppingPage }) => {
        await shoppingPage.addInventoryItemToCart(selectedItem);
        await shoppingPage.checkItemsInCart(1);
        await shoppingPage.clickButton('Checkout');
        await shoppingPage.fillUserDetails(firstName, lastName, zip);
        await shoppingPage.clickButton('Continue');
        await shoppingPage.checkCheckoutErrorMessage(error);
      });
    }
  });

  test.describe('Checkout cancel and navigation', () => {
    test('cancel checkout on Your Information step: expect return to cart with item intact', async ({ shoppingPage }) => {
      await shoppingPage.addInventoryItemToCart(selectedItem);
      await shoppingPage.checkItemsInCart(1);
      await shoppingPage.clickButton('Checkout');
      await shoppingPage.clickCancelButton();
      await shoppingPage.checkUrlLocation(`${config.baseUrl}/cart.html`);
      await shoppingPage.checkCartContainsItem(selectedItem);
    });

    test('cancel checkout on overview step: expect return to inventory page', async ({ shoppingPage }) => {
      await shoppingPage.addInventoryItemToCart(selectedItem);
      await shoppingPage.checkItemsInCart(1);
      await shoppingPage.clickButton('Checkout');
      await shoppingPage.fillUserDetails(firstName, lastName, zipCode);
      await shoppingPage.clickButton('Continue');
      await shoppingPage.clickCancelButton();
      await shoppingPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    });

    test('click Continue Shopping on cart page: expect return to inventory page', async ({ shoppingPage }) => {
      await shoppingPage.addInventoryItemToCart(selectedItem);
      await shoppingPage.checkItemsInCart(1);
      await shoppingPage.clickContinueShopping();
      await shoppingPage.checkUrlLocation(`${config.baseUrl}/inventory.html`);
    });
  });

  test.describe('Sorting', () => {
    test('sort products by name Z to A: expect descending alphabetical order', async ({ shoppingPage }) => {
      await shoppingPage.sortProductsBy('za');
      await shoppingPage.checkProductsSortedByNameDescending();
    });

    test('sort products by price low to high: expect ascending price order', async ({ shoppingPage }) => {
      await shoppingPage.sortProductsBy('lohi');
      await shoppingPage.checkProductsSortedByPriceAscending();
    });

    test('sort products by price high to low: expect descending price order', async ({ shoppingPage }) => {
      await shoppingPage.sortProductsBy('hilo');
      await shoppingPage.checkProductsSortedByPriceDescending();
    });
  });

  test.describe('Price verification', () => {
    test('complete checkout with single item: expect totals to match item price and tax', async ({ shoppingPage }) => {
      const itemPrice = await shoppingPage.getInventoryItemPrice(selectedItem);

      await shoppingPage.addInventoryItemToCart(selectedItem);
      await shoppingPage.checkItemsInCart(1);
      await shoppingPage.clickButton('Checkout');
      await shoppingPage.fillUserDetails(firstName, lastName, zipCode);
      await shoppingPage.clickButton('Continue');
      await shoppingPage.checkCheckoutTotalsForItem(itemPrice);
    });
  });

  test.describe('Product detail page', () => {
    test('click product name: expect detail page to show correct name and price', async ({ shoppingPage }) => {
      const price = await shoppingPage.getInventoryItemPrice(selectedItem);

      await shoppingPage.openProductDetail(selectedItem);
      await shoppingPage.checkProductDetailPage(selectedItem, price);
    });

    test('add to cart from detail page: expect cart badge to update', async ({ shoppingPage }) => {
      await shoppingPage.openProductDetail(selectedItem);
      await shoppingPage.addToCartFromDetailPage();
      await shoppingPage.checkCartBadgeCount(1);
    });
  });

  test.describe('Cart and session persistence', () => {
    test('reload page after adding item: expect cart badge to persist', async ({ shoppingPage }) => {
      await shoppingPage.addInventoryItemToCart(selectedItem);
      await shoppingPage.checkCartBadgeCount(1);
      await shoppingPage.reloadPage();
      await shoppingPage.checkCartBadgeCount(1);
    });

    test('visit cart page directly with no items added: expect empty cart', async ({ shoppingPage }) => {
      await shoppingPage.goToURL(`${config.baseUrl}/cart.html`);
      await shoppingPage.checkCartIsEmpty();
    });
  });
});