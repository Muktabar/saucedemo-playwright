import { test, expect } from '@playwright/test';
import { loginAsStandardUser, submitLogin } from '../support';

test.describe('Authentication', () => {
  test('AUTH-01 valid user can sign in @smoke', async ({ page }) => {
    await loginAsStandardUser(page);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('AUTH-02 invalid credentials are rejected @negative', async ({ page }) => {
    await submitLogin(page, 'not_a_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match any user in this service',
    );
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('AUTH-03 locked out user cannot sign in @negative', async ({ page }) => {
    await submitLogin(page, 'locked_out_user', 'secret_sauce');

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out',
    );
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('AUTH-04 username is required @negative', async ({ page }) => {
    await submitLogin(page, '', 'secret_sauce');

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username is required',
    );
  });

  test('AUTH-05 password is required @negative', async ({ page }) => {
    await submitLogin(page, 'standard_user', '');

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Password is required',
    );
  });

  test('AUTH-06 user can log out @smoke', async ({ page }) => {
    await loginAsStandardUser(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('AUTH-07 inventory requires an authenticated session @regression', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
