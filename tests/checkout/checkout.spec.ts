import { test, expect, type Page } from '@playwright/test';
import { loginAsStandardUser } from '../support';

async function addBackpackAndOpenCart(page: Page): Promise<void> {
  await loginAsStandardUser(page);
  const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('[data-test="shopping-cart-link"]').click();
}

async function continueWithValidInformation(page: Page): Promise<void> {
  await page.locator('[data-test="firstName"]').fill('Taylor');
  await page.locator('[data-test="lastName"]').fill('Tester');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();
}

function amountFrom(text: string): number {
  return Number(text.match(/\$([0-9]+\.[0-9]{2})/)?.[1]);
}

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await addBackpackAndOpenCart(page);
  });

  test('CHK-01 proceed from cart to checkout information @smoke', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('CHK-02 first name is required @negative', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('CHK-03 last name is required @negative', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.locator('[data-test="firstName"]').fill('Taylor');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('CHK-04 postal code is required @negative', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.locator('[data-test="firstName"]').fill('Taylor');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('CHK-05 cancel checkout overview @regression', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await continueWithValidInformation(page);
    await page.getByRole('button', { name: 'Cancel' }).click();

    // SauceDemo returns to inventory in Chromium and directly to the cart in WebKit.
    // In either case, cancellation should leave the item in the shopping cart.
    await expect(page).toHaveURL(/(?:inventory|cart)\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  });

  test('CHK-06 review items and totals before purchase @regression', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await continueWithValidInformation(page);

    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
    const subtotal = amountFrom(await page.locator('.summary_subtotal_label').innerText());
    const tax = amountFrom(await page.locator('.summary_tax_label').innerText());
    const total = amountFrom(await page.locator('.summary_total_label').innerText());

    expect(subtotal).toBe(29.99);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('CHK-07 finish checkout and see confirmation @smoke', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await continueWithValidInformation(page);
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
  });

  test('CHK-08 return home after completed order @regression', async ({ page }) => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await continueWithValidInformation(page);
    await page.getByRole('button', { name: 'Finish' }).click();
    await page.getByRole('button', { name: 'Back Home' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });
});
