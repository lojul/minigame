const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
});

test('setup screen is visible on load', async ({ page }) => {
  await page.goto('/games/memory-match.html');
  await expect(page.locator('#setupScreen')).toBeVisible();
});

test('game screen is hidden before start', async ({ page }) => {
  await page.goto('/games/memory-match.html');
  await expect(page.locator('#gameScreen')).not.toBeVisible();
});

test('card grid appears after clicking Start Game', async ({ page }) => {
  await page.goto('/games/memory-match.html');
  await page.locator('#startGameBtn').click();
  await expect(page.locator('#gameScreen')).toBeVisible();
  const cards = page.locator('.card');
  await expect(cards).not.toHaveCount(0);
});

test('cards can be flipped', async ({ page }) => {
  await page.goto('/games/memory-match.html');
  await page.locator('#startGameBtn').click();
  const firstCard = page.locator('.card').first();
  await firstCard.click();
  await expect(firstCard).toHaveClass(/flipped/);
});

test('mismatched cards flip back', async ({ page }) => {
  await page.goto('/games/memory-match.html');
  await page.locator('#startGameBtn').click();

  const cards = page.locator('.card');

  // Click first two cards
  await cards.nth(0).click();
  await cards.nth(1).click();

  // After mismatch delay, no unmatched flipped cards should remain
  await page.waitForTimeout(1200);
  const unflipped = page.locator('.card.flipped:not(.matched)');
  await expect(unflipped).toHaveCount(0);
});
