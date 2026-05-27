const { test, expect } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const testData = require('../../data/test-data.json');

test.describe('Login Tests', () => {

  test('Login exitoso con standard_user', async ({ page }) => {
    await page.goto('/');

    const { username, password } = testData.usuarios.standard;
    await page.fill('#user-name', username);
    await page.fill('#password', password);

    await page.click('#login-button');

    await expect(page).toHaveURL(/.*inventory\.html/);

    const inventoryList = page.locator('.inventory_list');
    await expect(inventoryList).toBeVisible();

    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).not.toHaveCount(0);
  });

  test('Login fallido con locked_out_user', async ({ page }) => {
    await page.goto('/');

    const { username, password } = testData.usuarios.locked;

    await page.fill('#user-name', username);
    await page.fill('#password', password);

    await page.click('#login-button');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

    await expect(page).toHaveURL(/.*\/$/);
  });

});
