const { test, expect } = require('@playwright/test');

test('GET /manifest.json returns 200', async ({ request }) => {
  const response = await request.get('/manifest.json');
  expect(response.status()).toBe(200);
});

test('manifest.name equals "Mini Games Arcade"', async ({ request }) => {
  const response = await request.get('/manifest.json');
  const manifest = await response.json();
  expect(manifest.name).toBe('Mini Games Arcade');
});

test('<link rel="manifest"> present in index.html', async ({ page }) => {
  await page.goto('/');
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
});
