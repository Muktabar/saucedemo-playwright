import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../support';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('INV-01 inventory shows product cards @smoke', async ({ page }) => {
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    const firstCard = page.locator('.inventory_item').first();
    await expect(firstCard.locator('.inventory_item_name')).toBeVisible();
    await expect(firstCard.locator('.inventory_item_price')).toBeVisible();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('INV-02 sort products by name A to Z @regression', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('az');

    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('INV-03 sort products by name Z to A @regression', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('INV-04 sort products by price low to high @regression', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const prices = (await page.locator('.inventory_item_price').allTextContents())
      .map((price) => Number(price.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('.inventory_item_name').last()).toHaveText('Sauce Labs Fleece Jacket');
  });

  test('INV-05 sort products by price high to low @regression', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    const prices = (await page.locator('.inventory_item_price').allTextContents())
      .map((price) => Number(price.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('INV-06 open a product detail page @regression', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack', { exact: true }).click();

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('INV-07 return from product detail to inventory @regression', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack', { exact: true }).click();
    await page.getByRole('button', { name: 'Back to products' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});
