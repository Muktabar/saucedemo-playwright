import { test, expect, type Page } from '@playwright/test';
import { loginAsStandardUser } from '../support';

async function addProduct(page: Page, productName: string): Promise<void> {
  const productCard = page.locator('.inventory_item').filter({ hasText: productName });
  await productCard.getByRole('button', { name: 'Add to cart' }).click();
}

async function openCart(page: Page): Promise<void> {
  await page.locator('[data-test="shopping-cart-link"]').click();
}

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('CART-01 add a product from inventory @smoke', async ({ page }) => {
    await addProduct(page, 'Sauce Labs Backpack');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await openCart(page);

    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
  });

  test('CART-02 add multiple products @regression', async ({ page }) => {
    await addProduct(page, 'Sauce Labs Backpack');
    await addProduct(page, 'Sauce Labs Bike Light');

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await openCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.cart_item')).toContainText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
  });

  test('CART-03 cart shows selected product, quantity, and price @smoke', async ({ page }) => {
    await addProduct(page, 'Sauce Labs Backpack');
    await openCart(page);

    const backpackRow = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackRow.locator('.cart_quantity')).toHaveText('1');
    await expect(backpackRow.locator('.inventory_item_price')).toHaveText('$29.99');
  });

  test('CART-04 remove a product from the cart @regression', async ({ page }) => {
    await addProduct(page, 'Sauce Labs Backpack');
    await openCart(page);

    const backpackRow = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpackRow.getByRole('button', { name: 'Remove' }).click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });

  test('CART-05 remove a product from inventory @regression', async ({ page }) => {
    await addProduct(page, 'Sauce Labs Backpack');
    const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpackCard.getByRole('button', { name: 'Remove' }).click();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
    await openCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('CART-06 continue shopping from the cart @regression', async ({ page }) => {
    await addProduct(page, 'Sauce Labs Backpack');
    await openCart(page);
    await page.getByRole('button', { name: 'Continue Shopping' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('CART-07 empty cart shows no product rows @regression', async ({ page }) => {
    await openCart(page);

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
  });
});
