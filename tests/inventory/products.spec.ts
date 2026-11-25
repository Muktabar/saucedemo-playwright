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

  test('INV-08 product cards show the correct details @regression', async ({ page }) => {
    const expectedProducts = [
      {
        name: 'Sauce Labs Backpack',
        description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
        price: '$29.99',
      },
      {
        name: 'Sauce Labs Bike Light',
        description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
        price: '$9.99',
      },
      {
        name: 'Sauce Labs Bolt T-Shirt',
        description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
        price: '$15.99',
      },
      {
        name: 'Sauce Labs Fleece Jacket',
        description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
        price: '$49.99',
      },
      {
        name: 'Sauce Labs Onesie',
        description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
        price: '$7.99',
      },
      {
        name: 'Test.allTheThings() T-Shirt (Red)',
        description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
        price: '$15.99',
      },
    ];

    const productCards = page.locator('.inventory_item');
    await expect(productCards).toHaveCount(expectedProducts.length);

    for (const [index, product] of expectedProducts.entries()) {
      const card = productCards.nth(index);

      await expect(card.locator('.inventory_item_name')).toHaveText(product.name);
      await expect(card.locator('.inventory_item_desc')).toHaveText(product.description);
      await expect(card.locator('.inventory_item_price')).toHaveText(product.price);
      const addToCartButton = card.getByRole('button', { name: 'Add to cart', exact: true });
      await expect(addToCartButton).toBeVisible();
      await expect(addToCartButton).toBeEnabled();
    }
  });
});
