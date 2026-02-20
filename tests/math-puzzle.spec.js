const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('setup screen is visible on load', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await expect(page.locator('#setupScreen')).toBeVisible();
});

test('game screen is hidden before start', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await expect(page.locator('#gameScreen')).not.toBeVisible();
});

test('difficulty options are displayed', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  const diffButtons = page.locator('.diff-btn');
  await expect(diffButtons).toHaveCount(3);
});

test('easy difficulty is selected by default', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  const easyBtn = page.locator('.diff-btn[data-diff="easy"]');
  await expect(easyBtn).toHaveClass(/selected/);
});

test('difficulty can be changed', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  const mediumBtn = page.locator('.diff-btn[data-diff="medium"]');
  await mediumBtn.click();
  await expect(mediumBtn).toHaveClass(/selected/);
});

test('puzzle grid appears after starting game', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await page.locator('#startBtn').click();
  await expect(page.locator('#gameScreen')).toBeVisible();
  await expect(page.locator('#puzzleGrid')).toBeVisible();
});

test('numpad is displayed in game', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await page.locator('#startBtn').click();
  const numpad = page.locator('#numpad');
  await expect(numpad).toBeVisible();
  const numButtons = page.locator('.num-btn');
  const count = await numButtons.count();
  expect(count).toBeGreaterThanOrEqual(10);
});

test('input cells can be selected', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await page.locator('#startBtn').click();

  const inputCell = page.locator('.cell.input').first();
  await inputCell.click();
  await expect(inputCell).toHaveClass(/selected/);
});

test('number can be entered in selected cell', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await page.locator('#startBtn').click();

  const inputCell = page.locator('.cell.input').first();
  await inputCell.click();
  await page.locator('.num-btn').first().click();

  const cellText = await inputCell.textContent();
  expect(cellText).not.toBe('');
});

test('check answer button is visible', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await page.locator('#startBtn').click();
  await expect(page.locator('#checkBtn')).toBeVisible();
});

test('back button navigates to home', async ({ page }) => {
  await page.goto('/games/math-puzzle.html');
  await page.locator('.back-btn').click();
  await expect(page).toHaveURL(/(index\.html|\/$)/);
});
