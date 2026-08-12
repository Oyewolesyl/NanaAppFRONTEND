/*
  handover: frontend boot and routing
  - this file owns the browser-side app shell: splash, hash routing, page rendering, fixed header, overlays, and bottom navigation.
  - keep the opening wink/smile splash separate from the get-started screen. the splash is only the temporary brand transition; get-started is the first product screen.
  - screens are rendered into #app from route-specific functions. shared state comes from appState.js, and backend calls are intentionally non-blocking so the mobile flow still works on slow networks.
  - visual changes should be checked on small mobile heights first, because safari browser chrome and the fixed bottom nav are the easiest places to create clipping.
*/
// Legacy mobile fit rules load first; styles.scss ends with the current
// Figma-aligned design-system layer that should win final visual conflicts.
import './mobileNavFixes.scss';
import './styles.scss';
import './launchPolish.scss';

import { renderGetStartedScreen } from './screens/getStartedScreen';
import { renderSelectRoleScreen } from './screens/selectRoleScreen';
import { renderAuthScreen } from './screens/authScreen';
import { renderHomepageNewUserScreen } from './screens/homepageNewUserScreen';
import { renderChildAddedScreen } from './screens/childAddedScreen';
import { renderSecondChildAddedScreen } from './screens/secondChildAddedScreen';
import { renderShowPainScreen } from './screens/ShowpainScreen';
import { renderPainTypeScreen } from './screens/Paintypescreen';
import { renderWhenDidItStartScreen } from './screens/WhenDidItStartScreen';
import { renderPainScaleScreen } from './screens/Painscalescreen';
import { renderSummaryScreen } from './screens/summaryScreen';
import { renderConfirmationScreen } from './screens/confirmationScreen';
import { renderHistoryScreen } from './screens/historyScreen';
import { renderSettingsScreen } from './screens/settingsScreen';
import { renderManageChildrenScreen } from './screens/manageChildrenScreen';
import { renderAssistantScreen } from './screens/assistantScreen';
import { appState, syncLocalDataToBackend } from './appState';
import { ASSETS } from './assets';
import { showGuidedTourForRoute } from './appTour';

let previousHash = '#get-started';
let assetObserverInstalled = false;
let criticalAssetsStarted = false;
let deferredInstallPrompt = null;
let installPromptRendered = false;
let backendBootSyncStarted = false;

// Keep this list small and launch-critical. These assets appear early in the
// flow or are expensive enough that a delayed load would make the app feel
// unfinished, especially on the 3D body-map screen.
const CRITICAL_ASSETS = [
  ASSETS.logoMark,
  ASSETS.logoText,
  ASSETS.logoFull,
  ASSETS.logoCard,
  ASSETS.winkFace1,
  ASSETS.winkFace2,
  ASSETS.winkFace3,
  ASSETS.caregiverIcon,
  ASSETS.doctorIcon,
  ASSETS.backChevron,
  ASSETS.navHome,
  ASSETS.navClock,
  ASSETS.navHistoryActive,
  ASSETS.navSettingsActive,
  ASSETS.navSettingsInactive,
  ASSETS.childPhoto,
  ASSETS.secondChildPhoto,
  ASSETS.inactiveChildPhoto,
  '/bodymap.glb',
].filter(Boolean);

function prepareAsset(node) {
  if (!(node instanceof HTMLImageElement) || node.dataset.assetReady) return;

  node.dataset.assetReady = 'pending';
  node.classList.add('asset-loading');

  const finish = () => {
    node.dataset.assetReady = 'true';
    node.classList.remove('asset-loading');
    node.classList.add('asset-loaded');
  };

  if (node.complete && node.naturalWidth > 0) {
    finish();
    return;
  }

  node.addEventListener('load', finish, { once: true });
  node.addEventListener('error', () => {
    node.dataset.assetReady = 'error';
    node.classList.remove('asset-loading');
    node.classList.add('asset-error');
  }, { once: true });
}

function installAssetLoadingObserver() {
  if (assetObserverInstalled) return;
  assetObserverInstalled = true;

  // Every image added after a route change gets the same fade-in/fallback state.
  // This avoids individual screens having to remember asset loading behavior.
  document.querySelectorAll('img').forEach(prepareAsset);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        prepareAsset(node);
        node.querySelectorAll?.('img').forEach(prepareAsset);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
}

function preloadAsset(url) {
  if (!url || url.startsWith('data:')) return Promise.resolve();

  if (url.endsWith('.glb')) {
    return fetch(url, { cache: 'force-cache' }).catch(() => null);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = resolve;
    img.onerror = resolve;
    img.src = url;
  });
}

function preloadCriticalAssets() {
  if (criticalAssetsStarted) return;
  criticalAssetsStarted = true;

  // Fire-and-forget by design: preloading should improve perceived speed but
  // must never block the app from rendering on a weak or offline connection.
  Promise.allSettled(CRITICAL_ASSETS.map(preloadAsset));
}

function scheduleBackendBootSync() {
  if (backendBootSyncStarted) return;
  if (!localStorage.getItem('nana_access_token')) return;

  backendBootSyncStarted = true;

  // Existing users may already have children and pain logs saved in this
  // browser from before backend sync existed. Run this once after the first
  // paint so the manager can receive those records without forcing a logout.
  window.setTimeout(() => {
    syncLocalDataToBackend().catch(() => null);
  }, 900);
}

function showLaunchSplash() {
  if (window.__nanaLaunchSplashShown) return;
  window.__nanaLaunchSplashShown = true;

  const splash = document.createElement('div');
  splash.className = 'nana-launch-splash';
  splash.setAttribute('aria-hidden', 'true');
  splash.innerHTML = `
    <span class="nana-launch-wink">
      <img src="${ASSETS.winkFace1}" alt="" class="nana-launch-wink__frame nana-launch-wink__frame--one" />
      <img src="${ASSETS.winkFace2}" alt="" class="nana-launch-wink__frame nana-launch-wink__frame--two" />
      <img src="${ASSETS.winkFace3}" alt="" class="nana-launch-wink__frame nana-launch-wink__frame--three" />
    </span>
  `;

  document.body.append(splash);

  window.setTimeout(() => {
    splash.classList.add('nana-launch-splash--leaving');
  }, 2850);

  window.setTimeout(() => {
    splash.remove();
  }, 3400);
}

function startRouteLoading(app, route) {
  app.setAttribute('aria-busy', 'true');
  document.body.classList.add('nana-route-is-loading');

  let loader = document.querySelector('.nana-route-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'nana-route-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.innerHTML = '<span>Loading Nana</span><i></i>';
    document.body.append(loader);
  }

  loader.hidden = false;
  loader.querySelector('span').textContent =
    route === '#body-map' ? 'Preparing 3D body map' : 'Loading Nana';
}

function finishRouteLoading(app) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      app.removeAttribute('aria-busy');
      document.body.classList.remove('nana-route-is-loading');
      document.querySelector('.nana-route-loader')?.setAttribute('hidden', '');
    }, 140);
  });
}

function isStandaloneDisplay() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isLikelyIosBrowser() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent || '');
}

function createInstallPrompt() {
  if (installPromptRendered || isStandaloneDisplay()) return null;
  installPromptRendered = true;

  const prompt = document.createElement('aside');
  prompt.className = 'nana-install-prompt';
  prompt.hidden = true;
  prompt.innerHTML = `
    <img src="/pwa-icon-192.png" alt="" />
    <div>
      <strong>Add Nana to Home Screen</strong>
      <span data-install-copy>Open Nana faster from your phone or desktop.</span>
    </div>
    <button type="button" data-install-action>Install</button>
    <button type="button" data-install-dismiss aria-label="Dismiss install prompt">x</button>
  `;

  const copy = prompt.querySelector('[data-install-copy]');
  const action = prompt.querySelector('[data-install-action]');

  action.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice.catch(() => null);
      deferredInstallPrompt = null;
      prompt.hidden = true;
      return;
    }

    copy.textContent = isLikelyIosBrowser()
      ? 'Tap Share, then choose Add to Home Screen.'
      : 'Use your browser menu and choose Install app or Add to desktop.';
    action.textContent = 'Got it';
    action.addEventListener('click', () => {
      prompt.hidden = true;
    }, { once: true });
  });

  prompt.querySelector('[data-install-dismiss]').addEventListener('click', () => {
    localStorage.setItem('nana_install_prompt_dismissed', 'true');
    prompt.hidden = true;
  });

  document.body.append(prompt);
  return prompt;
}

function showInstallPrompt({ force = false } = {}) {
  if (isStandaloneDisplay()) return;
  if (!force && localStorage.getItem('nana_install_prompt_dismissed') === 'true') return;

  const prompt = document.querySelector('.nana-install-prompt') || createInstallPrompt();
  if (!prompt) return;

  const action = prompt.querySelector('[data-install-action]');
  const copy = prompt.querySelector('[data-install-copy]');
  action.textContent = deferredInstallPrompt ? 'Install' : 'How';
  copy.textContent = 'Open Nana faster from your phone or desktop.';
  prompt.hidden = false;
}

function installPwaSupport() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => null);
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallPrompt();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    document.querySelector('.nana-install-prompt')?.remove();
  });

  window.addEventListener('nana:show-install-prompt', (event) => {
    showInstallPrompt({ force: Boolean(event.detail?.force) });
  });

  setTimeout(() => {
    if (isLikelyIosBrowser()) showInstallPrompt();
  }, 1400);
}

function promoteRouteOverlays(app) {
  const actionRow = app.querySelector('.pain-type-actions, .confirmation-actions');

  document.querySelectorAll('body > .pain-type-actions, body > .confirmation-actions').forEach((node) => {
    if (node !== actionRow) node.remove();
  });

  if (actionRow && actionRow.parentElement !== document.body) {
    // Pain-flow actions are visually fixed controls. Keeping them in <body>
    // avoids transformed or scrollable screen containers changing their anchor.
    document.body.append(actionRow);
  }
}

function renderApp() {
  const app = document.querySelector('#app');
  if (!app) return;

  const route = (window.location.hash || '#get-started').split('?')[0] || '#get-started';
  startRouteLoading(app, route);
  document.body.dataset.route = route.replace('#', '');

  // Header, menu, bottom nav, and floating add button are moved to <body> on
  // mobile so they can stay fixed above each screen without being clipped by
  // the current route container. Remove stale copies before rendering a route.
  document.querySelectorAll('body > .children-header, body > .nana-menu-overlay, body > .bottom-nav, body > .floating-add-btn, body > .pain-type-actions, body > .confirmation-actions, body > .landing-ai-wink').forEach((node) => node.remove());

  try {
    if (route === '#select-role') return renderSelectRoleScreen(app);
    if (route === '#auth') return renderAuthScreen(app);
    if (route === '#homepage-newuser') return renderHomepageNewUserScreen(app);
    if (route === '#child-added') return appState.children.length ? renderChildAddedScreen(app) : renderHomepageNewUserScreen(app);
    if (route === '#second-child-added') return renderSecondChildAddedScreen(app);
    if (route === '#manage-children') return renderManageChildrenScreen(app);
    if (route === '#history') return renderHistoryScreen(app);
    if (route === '#assistant') return renderAssistantScreen(app);
    if (route === '#settings') return renderSettingsScreen(app);

    if (route === '#body-map') {
      return renderShowPainScreen(app, {
        fromScreen: ['#child-added', '#second-child-added', '#manage-children'].includes(previousHash)
          ? previousHash
          : '#child-added',
      });
    }

    if (route === '#pain-type') return renderPainTypeScreen(app, { fromScreen: '#body-map' });
    if (route === '#when-did-it-start') return renderWhenDidItStartScreen(app, { fromScreen: '#pain-type' });
    if (route === '#pain-scale') return renderPainScaleScreen(app, { fromScreen: '#when-did-it-start' });
    if (route === '#summary') return renderSummaryScreen(app);
    if (route === '#confirmation') return renderConfirmationScreen(app);

    renderGetStartedScreen(app);
  } finally {
    promoteRouteOverlays(app);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      app.querySelector('.screen')?.scrollTo?.(0, 0);
      showGuidedTourForRoute();
    });
    finishRouteLoading(app);
  }
}

window.addEventListener('hashchange', (event) => {
  previousHash = event.oldURL ? new URL(event.oldURL).hash || '#get-started' : previousHash;
  renderApp();
});

window.addEventListener('nana:rerender', renderApp);

if (!window.location.hash) window.location.hash = '#get-started';

installAssetLoadingObserver();
preloadCriticalAssets();
installPwaSupport();
showLaunchSplash();
renderApp();
scheduleBackendBootSync();
