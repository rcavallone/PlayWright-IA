const { test, expect } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Load test data
const testData = require('../../data/test-data.json');

test.describe('Verify Cart Tests', () => {

  test('Agregar Sauce Labs Bike Light al carrito y verificar en cart.html', async ({ page }) => {
    // 1. Login con standard_user
    await page.goto('/');

    const { username, password } = testData.usuarios.standard;
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');

    // Verificar que redirige a /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 2. Agregar "Sauce Labs Bike Light" al carrito (precio: $9.99)
    // Buscar el botón "Add to cart" correspondiente a "Sauce Labs Bike Light"
    const bikeLightItem = page.locator('.inventory_item', { hasText: 'Sauce Labs Bike Light' });
    await expect(bikeLightItem).toBeVisible();

    // Verificar el precio del producto
    const bikeLightPrice = bikeLightItem.locator('.inventory_item_price');
    await expect(bikeLightPrice).toHaveText('$9.99');

    // Agregar al carrito
    await bikeLightItem.locator('button:has-text("Add to cart")').click();

    // Verificar que el contador del carrito muestra "1"
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // 3. Ir a la página del carrito (cart.html)
    await page.click('.shopping_cart_link');

    // Verificar que estamos en cart.html
    await expect(page).toHaveURL(/.*cart\.html/);

    // 4. Verificar que el producto "Sauce Labs Bike Light" está en el carrito
    const cartItem = page.locator('.cart_item', { hasText: 'Sauce Labs Bike Light' });
    await expect(cartItem).toBeVisible();

    // 5. Verificar que el precio mostrado es "$9.99"
    const cartItemPrice = cartItem.locator('.inventory_item_price');
    await expect(cartItemPrice).toHaveText('$9.99');

    // 6. Verificar que solo hay 1 producto en el carrito
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
  });

});
