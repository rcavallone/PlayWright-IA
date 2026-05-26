const { test, expect } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Load test data
const testData = require('../../data/test-data.json');

test.describe('Select Product Tests', () => {

  test('Seleccionar Sauce Labs Backpack, verificar precio y agregar al carrito', async ({ page }) => {
    // 1. Login con standard_user
    await page.goto('/');

    const { username, password } = testData.usuarios.standard;
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');

    // Verificar que redirige a /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 2. Seleccionar "Sauce Labs Backpack"
    await page.click('text=Sauce Labs Backpack');

    // 3. Obtener el precio del producto (debe ser "$29.99")
    const priceElement = page.locator('[data-test="inventory-item-price"]');
    await expect(priceElement).toBeVisible();
    const priceText = await priceElement.textContent();
    expect(priceText.trim()).toBe('$29.99');

    // 4. Agregar el producto al carrito
    await page.click('[data-test="add-to-cart"]');

    // 5. Verificar que el contador del carrito muestra "1"
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

});
