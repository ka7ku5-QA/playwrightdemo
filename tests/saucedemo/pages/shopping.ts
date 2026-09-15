import { expect } from '@playwright/test';
import { config } from '../config';
import { SharedPage } from './shared';
import { INVENTORY_PRODUCTS } from '../helpers/productData';



export class ShoppingPage extends SharedPage {

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

    async fillUserDetails(firstName: string, lastName: string, zipCode: string) {
        await this.page.getByPlaceholder('First Name').fill(firstName);
        await this.page.getByPlaceholder('Last Name').fill(lastName);
        await this.page.getByPlaceholder('Zip/Postal Code').fill(zipCode);
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

      async removeItemFromInventory(itemName: string){
        const selectItem = this.page.locator('.inventory_item', {
            hasText: itemName,
          });
        await selectItem.getByRole('button', { name: 'Remove' }).click();
    }

    async removeMultipleInventoryItems(items: string[]) {
        for (const item of items) {
          await this.removeItemFromInventory(item);
        }
      }

      async checkCartContainsItem(itemName: string) {
        await expect(
          this.page.locator('[data-test="inventory-item-name"]', {
            hasText: itemName,
          })
        ).toBeVisible();
      }

      async checkCartContainsMultipleItems(items: string[]) {
        for (const item of items) {
          await this.checkCartContainsItem(item);
        }
      }

      async checkCartIsEmpty() {
        await expect(this.page.locator('.cart_item')).toHaveCount(0);
        await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
      }

      async removeItemFromCartPage(itemName: string) {
        const cartItem = this.page.locator('.cart_item', {
          hasText: itemName,
        });
      
        await cartItem.getByRole('button', { name: 'Remove' }).click();
      }

      async removeMultipleItemsFromCartPage(items: string []){
        for (const item of items) {
            await this.removeItemFromCartPage(item);
          }
      }

      async checkCheckoutErrorMessage(expectedError: string) {
        await expect(this.page.locator('[data-test="error"]')).toHaveText(expectedError);
      }
      
      async sortProductsBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
      }
      
      async getFirstAndLastProductNames() {
        const names = this.page.locator('[data-test="inventory-item-name"]');
        const first = await names.first().textContent();
        const last = await names.last().textContent();
        return { first, last };
      }
      
      async getFirstAndLastProductPrices() {
        const prices = this.page.locator('[data-test="inventory-item-price"]');
        const first = await prices.first().textContent();
        const last = await prices.last().textContent();
        return { first, last };
      }
      
      async getInventoryItemPrice(itemName: string): Promise<string> {
        const item = this.page.locator('.inventory_item', { hasText: itemName });
        return (await item.locator('[data-test="inventory-item-price"]').textContent()) ?? '';
      }
      
      async checkCheckoutSummaryTotals(expectedSubtotal: string, expectedTax: string, expectedTotal: string) {
        await expect(this.page.locator('.summary_subtotal_label')).toHaveText(expectedSubtotal);
        await expect(this.page.locator('.summary_tax_label')).toHaveText(expectedTax);
        await expect(this.page.locator('.summary_total_label')).toHaveText(expectedTotal);
      }
      
      async clickCancelButton() {
        await this.page.getByRole('button', { name: 'Cancel' }).click();
      }
      
      async clickContinueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
      }
      
      async openProductDetail(itemName: string) {
        await this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }).click();
        await this.page.waitForURL(/inventory-item\.html\?id=\d+/);
      }
      
      async checkProductDetailPage(expectedName: string, expectedPrice: string) {
        await expect(this.page.locator('.inventory_details_name')).toHaveText(expectedName);
        await expect(this.page.locator('.inventory_details_price')).toHaveText(expectedPrice);
      }

      async checkProductsSortedByNameAscending() {
        const { first, last } = await this.getFirstAndLastProductNames();
        const sorted = [...INVENTORY_PRODUCTS].sort();
        expect(first).toBe(sorted[0]);
        expect(last).toBe(sorted[sorted.length - 1]);
      }
      
      async checkProductsSortedByNameDescending() {
        const { first, last } = await this.getFirstAndLastProductNames();
        const sorted = [...INVENTORY_PRODUCTS].sort().reverse();
        expect(first).toBe(sorted[0]);
        expect(last).toBe(sorted[sorted.length - 1]);
      }
      
      async checkProductsSortedByPriceAscending() {
        const { first, last } = await this.getFirstAndLastProductPrices();
        const firstValue = parseFloat((first ?? '').replace('$', ''));
        const lastValue = parseFloat((last ?? '').replace('$', ''));
        expect(firstValue).toBeLessThanOrEqual(lastValue);
      }
      
      async checkProductsSortedByPriceDescending() {
        const { first, last } = await this.getFirstAndLastProductPrices();
        const firstValue = parseFloat((first ?? '').replace('$', ''));
        const lastValue = parseFloat((last ?? '').replace('$', ''));
        expect(firstValue).toBeGreaterThanOrEqual(lastValue);
      }

      async checkCheckoutTotalsForItem(itemPriceText: string) {
        const subtotal = parseFloat(itemPriceText.replace('$', ''));
        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const total = Math.round((subtotal + tax) * 100) / 100;
      
        await this.checkCheckoutSummaryTotals(
          `Item total: $${subtotal.toFixed(2)}`,
          `Tax: $${tax.toFixed(2)}`,
          `Total: $${total.toFixed(2)}`
        );
      }
      
      async addToCartFromDetailPage() {
        await this.page.getByRole('button', { name: 'Add to cart' }).click();
      }
}