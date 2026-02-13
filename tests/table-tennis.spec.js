const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('setup screen is visible on load', async ({ page }) => {
  await page.goto('/games/table-tennis.html');
  await expect(page.locator('#setupScreen')).toBeVisible();
});

test('canvas is present in DOM', async ({ page }) => {
  await page.goto('/games/table-tennis.html');
  await expect(page.locator('#gameCanvas')).toBeAttached();
});

test('start button begins the game', async ({ page }) => {
  await page.goto('/games/table-tennis.html');
  await page.locator('#startBtn').click();
  await expect(page.locator('#gameScreen')).toBeVisible();
});

test('back button points to index', async ({ page }) => {
  await page.goto('/games/table-tennis.html');
  const href = await page.locator('a.back-btn').getAttribute('href');
  expect(href).toBe('../index.html');
});

test('player 1 score starts at 0', async ({ page }) => {
  await page.goto('/games/table-tennis.html');
  await page.locator('#startBtn').click();
  await expect(page.locator('#p1Score')).toHaveText('0');
});

test('2-player mode hides AI difficulty group', async ({ page }) => {
  await page.goto('/games/table-tennis.html');
  await page.locator('[data-players="2"]').click();
  await expect(page.locator('#difficultyGroup')).not.toBeVisible();
});
