const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('setup screen is visible on load', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await expect(page.locator('#setupScreen')).toBeVisible();
});

test('game screen is hidden before start', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await expect(page.locator('#gameScreen')).not.toBeVisible();
});

test('pokemon selection screen appears after clicking Choose Pokemon', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('#startBtn').click();
  await expect(page.locator('#selectScreen')).toBeVisible();
});

test('pokemon grid shows 9 pokemon options', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('#startBtn').click();
  const options = page.locator('.pokemon-option');
  await expect(options).toHaveCount(9);
});

test('pokemon can be selected', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('#startBtn').click();
  const firstPokemon = page.locator('.pokemon-option').first();
  await firstPokemon.click();
  await expect(firstPokemon).toHaveClass(/selected/);
});

test('battle screen appears after selecting pokemon and starting', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('#startBtn').click();
  await page.locator('.pokemon-option').first().click();
  await page.locator('#confirmPokemonBtn').click();
  await expect(page.locator('#gameScreen')).toBeVisible();
});

test('move buttons are displayed in battle', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('#startBtn').click();
  await page.locator('.pokemon-option').first().click();
  await page.locator('#confirmPokemonBtn').click();
  const moveButtons = page.locator('.move-btn');
  await expect(moveButtons).toHaveCount(3);
});

test('battle message updates after attack', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('#startBtn').click();
  await page.locator('.pokemon-option').first().click();
  await page.locator('#confirmPokemonBtn').click();

  const initialMessage = await page.locator('#battleMessage').textContent();
  await page.locator('.move-btn').first().click();

  // Wait for message to update
  await page.waitForTimeout(500);
  const newMessage = await page.locator('#battleMessage').textContent();
  expect(newMessage).not.toBe(initialMessage);
});

test('back button navigates to home', async ({ page }) => {
  await page.goto('/games/pokemon-battle.html');
  await page.locator('.back-btn').click();
  await expect(page).toHaveURL(/(index\.html|\/$)/);
});
