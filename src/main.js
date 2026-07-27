import './styles.scss';
import './mobileNavFixes.scss';

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
import { appState } from './appState';

let previousHash = '#get-started';
let assetObserverInstalled = false;

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

function renderApp() {
  const app = document.querySelector('#app');
  if (!app) return;

  const route = window.location.hash || '#get-started';
  document.body.dataset.route = route.replace('#', '');
  document.querySelectorAll('body > .children-header, body > .nana-menu-overlay, body > .bottom-nav, body > .floating-add-btn').forEach((node) => node.remove());

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
}

window.addEventListener('hashchange', (event) => {
  previousHash = event.oldURL ? new URL(event.oldURL).hash || '#get-started' : previousHash;
  renderApp();
});

window.addEventListener('nana:rerender', renderApp);

if (!window.location.hash) window.location.hash = '#get-started';

installAssetLoadingObserver();
renderApp();
