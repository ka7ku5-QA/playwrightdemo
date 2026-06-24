import { Page, expect } from '@playwright/test';
import { config } from '../config';
import { User } from '../credentials'



export class ShoppingPage {
     constructor(private readonly page: Page) {}

    async addInventoryItemToCart(itemName: string){
        const selectItem = this.page.locator('.inventory_item', {
            hasText: itemName,
          });
        await selectItem.getByRole('button', { name: 'Add to cart' }).click();
    }

    async addMultipleInventoryItemsToCart(items: string[]) {
        for (const item of items) {
          await this.addInventoryItemToCart(item);
        }
      }

    async checkItemsInCart(itemAmount: number){
        await this.page.locator('.shopping_cart_link').click();
        await expect(this.page).toHaveURL(`${config.baseUrl}/cart.html`);
        await expect(this.page.locator('.cart_item')).toHaveCount(itemAmount);
    }

    async clickButton(buttonName: string){
        await this.page.getByRole('button', { name: buttonName }).click();
    }

    async fillUserDetails(userDetails: User){
    await this.page.getByPlaceholder('First Name').fill(userDetails.account.firstName);
    await this.page.getByPlaceholder('Last Name').fill(userDetails.account.lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(userDetails.account.zipCode);
    }

    async checkConfirmationMessage(expectedConfirmationMessage: string, expectedDispatchMessage: string ){
        await expect(this.page.locator('.complete-header')).toHaveText(expectedConfirmationMessage);
        await expect(this.page.locator('.complete-text')).toHaveText(expectedDispatchMessage);
    }


    async checkProductsDisplayed(products: string[]) {
        await expect(this.page.locator('.inventory_item')).toHaveCount(
          products.length
        );
      
        for (const product of products) {
          await expect(
            this.page.locator('[data-test="inventory-item-name"]', {
              hasText: product,
            })
          ).toBeVisible();
        }
      }

      async checkCartBadgeCount(count: number) {
        const badge = this.page.locator('[data-test="shopping-cart-badge"]');
      
        if (count === 0) {
          await expect(badge).toHaveCount(0);
        } else {
          await expect(badge).toBeVisible();
          await expect(badge).toHaveText(String(count));
        }
      }

      async removeInventoryItemFromCart(itemName: string){
        const selectItem = this.page.locator('.inventory_item', {
            hasText: itemName,
          });
        await selectItem.getByRole('button', { name: 'Remove' }).click();
    }

    async removeMultipleInventoryItemsToCart(items: string[]) {
        for (const item of items) {
          await this.removeInventoryItemFromCart(item);
        }
      }
}