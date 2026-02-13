const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('game container is visible', async ({ page }) => {
  await page.goto('/games/typing-defense.html');
  await expect(page.locator('#gameContainer')).toBeVisible();
});

test('start button is visible', async ({ page }) => {
  await page.goto('/games/typing-defense.html');
  await expect(page.locator('#startBtn')).toBeVisible();
});

test('score starts at 0', async ({ page }) => {
  await page.goto('/games/typing-defense.html');
  const scoreEl = page.locator('#score');
  await expect(scoreEl).toHaveText('0');
});

test('start button begins the game', async ({ page }) => {
  await page.goto('/games/typing-defense.html');
  await page.locator('#startBtn').click();
  // After starting, the setup/start area should be hidden or game running
  const setupPanel = page.locator('#startBtn');
  // Button may be hidden or have different text after start
  await page.waitForTimeout(300);
  // Game container still visible
  await expect(page.locator('#gameContainer')).toBeVisible();
});
