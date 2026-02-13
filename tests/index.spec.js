const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('home page loads with title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Mini Games Arcade');
});

test('3 game cards are visible', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.game-card');
  await expect(cards).toHaveCount(3);
});

test('Memory Match card is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.game-card h2').filter({ hasText: 'Memory Match' })).toBeVisible();
});

test('Tetris card is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.game-card h2').filter({ hasText: 'Tetris' })).toBeVisible();
});

test('Typing Defense card is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.game-card h2').filter({ hasText: 'Typing Defense' })).toBeVisible();
});

test('scoreboard modal opens when a score button is clicked', async ({ page }) => {
  await page.goto('/');
  const modal = page.locator('#scoreboardModal');
  await expect(modal).not.toHaveClass(/show/);
  await page.locator('.score-btn').first().click();
  await expect(modal).toHaveClass(/show/);
});

test('scoreboard modal closes when close button is clicked', async ({ page }) => {
  await page.goto('/');
  await page.locator('.score-btn').first().click();
  const modal = page.locator('#scoreboardModal');
  await expect(modal).toHaveClass(/show/);
  await page.locator('#closeScoreboardBtn').click();
  await expect(modal).not.toHaveClass(/show/);
});
