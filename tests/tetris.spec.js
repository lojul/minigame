const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('canvas is visible', async ({ page }) => {
  await page.goto('/games/tetris.html');
  await expect(page.locator('#tetris')).toBeVisible();
});

test('start button is visible', async ({ page }) => {
  await page.goto('/games/tetris.html');
  await expect(page.locator('#startBtn')).toBeVisible();
});

test('start button starts the game', async ({ page }) => {
  await page.goto('/games/tetris.html');
  await page.locator('#startBtn').click();
  // After clicking start the button text changes to Restart
  await expect(page.locator('#startBtn')).toHaveText(/Restart|Pause/i);
});

test('back button points to index', async ({ page }) => {
  await page.goto('/games/tetris.html');
  const backBtn = page.locator('a.back-btn');
  await expect(backBtn).toBeVisible();
  const href = await backBtn.getAttribute('href');
  expect(href).toBe('../index.html');
});
