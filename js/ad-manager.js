/**
 * AdManager — unified ad abstraction for web (AdSense) only.
 *
 * Native ads (AdMob) have been removed for Kids Category compliance.
 * iOS Kids Category apps cannot use tracking or advertising frameworks.
 *
 * Web AdSense is only loaded in browser context (not native app).
 */

const AdManager = (() => {
  const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Replace with real AdSense publisher ID

  let _isNative = false;
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

  /**
   * Must be called once on DOMContentLoaded.
   */
  async function init() {
    if (_initialized) return;
    _initialized = true;
    _isNative = isNative();
    // Only load ads on web, not in native app (Kids Category compliance)
    if (!_isNative) {
      await loadAdSense();
    }
  }

  /**
   * Show a banner ad.
   * @param {string} containerId  — id of the <div> to inject <ins> into (web only).
   */
  async function showBanner(containerId) {
    // No ads in native app (Kids Category compliance)
    if (_isNative) return;

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
   * Hide the banner (no-op in native and web).
   */
  async function hideBanner() {
    // No-op: native ads removed for Kids Category compliance
  }

  /**
   * Show an interstitial ad, then call onClosed.
   * No ads shown in native app (Kids Category compliance).
   * @param {Function} onClosed
   */
  async function showInterstitial(onClosed) {
    // No ads in native app — call callback immediately
    if (typeof onClosed === 'function') onClosed();
  }

  /**
   * Show a rewarded video ad.
   * No ads shown in native app (Kids Category compliance).
   * @param {Function} onRewarded  — not called (no ads)
   * @param {Function} onClosed    — called immediately
   */
  async function showRewarded(onRewarded, onClosed) {
    // No ads in native app — call onClosed immediately
    if (typeof onClosed === 'function') onClosed();
  }

  return { init, showBanner, hideBanner, showInterstitial, showRewarded };
})();
