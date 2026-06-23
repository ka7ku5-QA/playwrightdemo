import { Page, expect } from '@playwright/test';
import { config } from '../config';
import { User } from '../credentials'



export class ShoppingPage {
     constructor(private readonly page: Page) {}

    async addInventoryItemToCart(itemName: string){
        const selectItem = this.page.locator('.inventory_item').filter({ hasText: itemName });
        await selectItem.getByRole('button', { name: 'Add to cart' }).click();
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

    async checkConfirmationMessage(expectedMessage: string){
        await expect(this.page.locator('.complete-header')).toHaveText(expectedMessage);
    }
}