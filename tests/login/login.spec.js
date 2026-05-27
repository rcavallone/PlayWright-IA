const { test, expect } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Load test data
const testData = require('../../data/test-data.json');

test.describe('Login Tests', () => {

  test('Login exitoso con standard_user', async ({ page }) => {
    // 1. Navegar a la página de login
    await page.goto('/');

    // 2. Completar credenciales del usuario standard
    const { username, password } = testData.usuarios.standard;
    await page.fill('#user-name', username);
    await page.fill('#password', password);

    // 3. Hacer clic en el botón de login
    await page.click('#login-button');

    // 4. Verificar que redirige a /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 5. Verificar que se muestra la lista de productos
    const inventoryList = page.locator('.inventory_list');
    await expect(inventoryList).toBeVisible();

    // Verificar que hay al menos un producto en la lista
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).not.toHaveCount(0);
  });

  test('Login fallido con locked_out_user', async ({ page }) => {
    // 1. Navegar a la página de login
    await page.goto('/');

    // 2. Obtener credenciales del archivo .env
    const { username, password } = testData.usuarios.locked;

    // Verificar que las variables de entorno están definidas

    // 3. Completar credenciales del usuario locked
    await page.fill('#user-name', username);
    await page.fill('#password', password);
  

    // 4. Hacer clic en el botón de login
    await page.click('#login-button');

    // 5. Verificar que se muestra el mensaje de error de usuario bloqueado
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

    // 6. Verificar que NO redirige a inventory (sigue en login)
    await expect(page).toHaveURL(/.*\/$/);
  });

});
