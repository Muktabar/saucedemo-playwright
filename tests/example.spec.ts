import { test, expect } from '@playwright/test';

test('user can log in and see the products', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory/);
  await expect(
    page.getByText('Products', { exact: true })
  ).toBeVisible();
});

test('user can add a product to the cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
});

test('user can sort products by price from low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  await expect(page.locator('.inventory_item_name').first())
    .toHaveText('Sauce Labs Onesie');
  await expect(page.locator('.inventory_item_name').last())
    .toHaveText('Sauce Labs Fleece Jacket');
});