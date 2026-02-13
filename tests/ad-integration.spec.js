const { test, expect } = require('@playwright/test');

const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co/**';

test.beforeEach(async ({ page }) => {
  await page.route(SUPABASE_URL, route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], error: null }) })
  );
  // Stub AdSense to avoid external network
  await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ status: 200, body: '' }));
});

test('/js/ad-manager.js returns 200', async ({ request }) => {
  const response = await request.get('/js/ad-manager.js');
  expect(response.status()).toBe(200);
});

test('AdManager.init() resolves without throwing on web', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    try {
      await AdManager.init();
      return 'ok';
    } catch (e) {
      return e.message;
    }
  });
  expect(result).toBe('ok');
});

test('showBanner() inserts <ins class="adsbygoogle"> into container', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await AdManager.init();
    await AdManager.showBanner('banner-ad');
  });
  const ins = page.locator('#banner-ad .adsbygoogle');
  await expect(ins).toHaveCount(1);
});

test('showInterstitial(cb) calls cb immediately on web', async ({ page }) => {
  await page.goto('/');
  const called = await page.evaluate(async () => {
    await AdManager.init();
    let called = false;
    await new Promise(resolve => {
      AdManager.showInterstitial(() => { called = true; resolve(); });
    });
    return called;
  });
  expect(called).toBe(true);
});

test('showRewarded(_, cb) calls cb immediately on web', async ({ page }) => {
  await page.goto('/');
  const called = await page.evaluate(async () => {
    await AdManager.init();
    let called = false;
    await new Promise(resolve => {
      AdManager.showRewarded(null, () => { called = true; resolve(); });
    });
    return called;
  });
  expect(called).toBe(true);
});
