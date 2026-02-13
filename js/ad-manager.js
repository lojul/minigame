/**
 * AdManager — unified ad abstraction for web (AdSense) and native (AdMob via Capacitor).
 *
 * Platform detection: window.Capacitor?.isNativePlatform() is always false in browsers.
 * All methods are safe no-ops / immediate callbacks on web.
 *
 * Ad unit IDs use Google's public test IDs.
 * Replace with real IDs from AdMob console before release.
 */

const AdManager = (() => {
  const TEST_IDS = {
    banner:       'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded:     'ca-app-pub-3940256099942544/5224354917',
  };

  const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Replace with real AdSense publisher ID

  let _isNative = false;
  let _admob = null;
  let _initialized = false;

  function isNative() {
    return typeof window !== 'undefined' &&
      window.Capacitor != null &&
      window.Capacitor.isNativePlatform();
  }

  async function loadAdSense() {
    if (document.querySelector('script[src*="adsbygoogle"]')) return;
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.setAttribute('data-ad-client', ADSENSE_CLIENT);
      script.onload = resolve;
      script.onerror = resolve; // silently ignore — ad block is fine
      document.head.appendChild(script);
    });
  }

  async function loadAdMob() {
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      _admob = AdMob;
      await AdMob.initialize({
        testingDevices: [],
        initializeForTesting: false,
      });
    } catch (e) {
      console.warn('AdMob init failed:', e);
    }
  }

  /**
   * Must be called once on DOMContentLoaded.
   */
  async function init() {
    if (_initialized) return;
    _initialized = true;
    _isNative = isNative();
    if (_isNative) {
      await loadAdMob();
    } else {
      await loadAdSense();
    }
  }

  /**
   * Show a banner ad.
   * @param {string} containerId  — id of the <div> to inject <ins> into (web only).
   */
  async function showBanner(containerId) {
    if (_isNative && _admob) {
      try {
        await _admob.showBanner({
          adId: TEST_IDS.banner,
          adSize: 'BANNER',
          position: 'BOTTOM_CENTER',
          margin: 0,
        });
      } catch (e) {
        console.warn('AdMob showBanner failed:', e);
      }
      return;
    }

    // Web: inject AdSense <ins> tag
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.querySelector('.adsbygoogle')) return; // already injected

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.cssText = 'display:block;width:100%;min-height:90px;';
    ins.setAttribute('data-ad-client', ADSENSE_CLIENT);
    ins.setAttribute('data-ad-slot', '1234567890'); // Replace with real slot
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    container.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silently ignore — ad blocker or not loaded yet
    }
  }

  /**
   * Hide the native banner (no-op on web).
   */
  async function hideBanner() {
    if (_isNative && _admob) {
      try {
        await _admob.hideBanner();
      } catch (e) {
        console.warn('AdMob hideBanner failed:', e);
      }
    }
  }

  /**
   * Show an interstitial ad, then call onClosed.
   * On web: calls onClosed synchronously (0ms delay).
   * @param {Function} onClosed
   */
  async function showInterstitial(onClosed) {
    if (_isNative && _admob) {
      try {
        await _admob.prepareInterstitial({ adId: TEST_IDS.interstitial });
        _admob.addListener('interstitialAdLoaded', async () => {
          await _admob.showInterstitial();
        });
        _admob.addListener('interstitialAdDismissed', () => {
          if (typeof onClosed === 'function') onClosed();
        });
        return;
      } catch (e) {
        console.warn('AdMob interstitial failed:', e);
      }
    }
    // Web: call callback immediately
    if (typeof onClosed === 'function') onClosed();
  }

  /**
   * Show a rewarded video ad.
   * On web: calls onClosed synchronously without calling onRewarded.
   * @param {Function} onRewarded  — called when user earns the reward
   * @param {Function} onClosed    — called when ad is dismissed (rewarded or not)
   */
  async function showRewarded(onRewarded, onClosed) {
    if (_isNative && _admob) {
      try {
        await _admob.prepareRewardVideoAd({ adId: TEST_IDS.rewarded });
        _admob.addListener('onRewardedVideoAdLoaded', async () => {
          await _admob.showRewardVideoAd();
        });
        _admob.addListener('onRewardedVideoAdReward', () => {
          if (typeof onRewarded === 'function') onRewarded();
        });
        _admob.addListener('onRewardedVideoAdClosed', () => {
          if (typeof onClosed === 'function') onClosed();
        });
        return;
      } catch (e) {
        console.warn('AdMob rewarded failed:', e);
      }
    }
    // Web: skip ad, call onClosed immediately
    if (typeof onClosed === 'function') onClosed();
  }

  return { init, showBanner, hideBanner, showInterstitial, showRewarded };
})();
