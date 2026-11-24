import type { Page } from '@playwright/test';

export async function submitLogin(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function loginAsStandardUser(page: Page): Promise<void> {
  await submitLogin(page, 'standard_user', 'secret_sauce');
}
