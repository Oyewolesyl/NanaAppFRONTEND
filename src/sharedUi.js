import { ASSETS } from './assets';
import { createAddChildOverlay } from './components/addChildOverlay';
import { getActiveChild, setActiveChild } from './appState';

const FALLBACKS = {
  home: '/home-active.svg',
  historyActive: '/history-active.svg',
  historyInactive: '/history-inactive.svg',
  settingsActive: '/settings-active.svg',
  settingsInactive: '/settings-inactive.svg',
  logo: '/logo.svg',
  menu: '/hamburgermenu.svg',
  child: '/inactivechildpicture.svg',
};

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function headerHtml(title = '') {
  return `
    <header class="children-header screen-header">
      <img
        src="${ASSETS.logoMark || FALLBACKS.logo}"
        alt="Nana"
        class="children-header-logo"
      />

      ${title ? `<h2 class="nav-page-title nav-page-title--header">${esc(title)}</h2>` : ''}

      <button
        type="button"
        class="children-menu-button"
        aria-label="Open menu"
        data-menu-button
      >
        <img src="${ASSETS.splashMenuIcon || ASSETS.menuIcon || FALLBACKS.menu}" alt="" />
      </button>
    </header>
  `;
}

function navIcon(type, active) {
  if (type === 'home') {
    return ASSETS.navHome || ASSETS.homeActive || ASSETS.homeIcon || FALLBACKS.home;
  }

  if (type === 'history') {
    return active
      ? (ASSETS.navHistoryActive || ASSETS.historyActive || FALLBACKS.historyActive)
      : (ASSETS.navClock || ASSETS.historyInactive || FALLBACKS.historyInactive);
  }

  if (type === 'settings') {
    return active
      ? (ASSETS.navSettingsActive || ASSETS.settingsActive || FALLBACKS.settingsActive)
      : (ASSETS.navSettingsInactive || ASSETS.settingsInactive || FALLBACKS.settingsInactive);
  }

  return '';
}

function navItem(type, active, label) {
  const isActive = active === type;
  const icon = navIcon(type, isActive);

  return `
    <button
      type="button"
      class="bottom-nav-item bottom-nav-item--${type} ${
        isActive ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'
      }"
      data-nav="${type}"
      aria-label="${label}"
      aria-current="${isActive ? 'page' : 'false'}"
    >
      <img src="${icon}" alt="" />
    </button>
  `;
}

export function bottomNavHtml(active = 'home') {
  return `
    <nav class="bottom-nav" aria-label="Main navigation">
      ${navItem('home', active, 'Home')}
      ${navItem('history', active, 'History')}
      ${navItem('settings', active, 'Settings')}
    </nav>
  `;
}

export function wireBottomNav(root = document) {
  root.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = button.dataset.nav;

      if (nav === 'home') window.location.hash = '#child-added';
      if (nav === 'history') window.location.hash = '#history';
      if (nav === 'settings') window.location.hash = '#settings';
    });
  });
}

export function attachMenu(root = document) {
  const menuButton = root.querySelector('[data-menu-button]');

  if (!menuButton) return;

  menuButton.addEventListener('click', () => {
    window.location.hash = '#settings';
  });
}

export function wireAddChildOverlay(root, overlayOrOptions = null, maybeOptions = {}) {
  const button =
    root?.querySelector?.('[data-add-child]') ||
    root?.querySelector?.('.children-add-button') ||
    root?.querySelector?.('.floating-add-btn') ||
    root?.querySelector?.('.manage-add');

  if (!button) return null;

  let overlay = overlayOrOptions;
  let options = maybeOptions || {};

  if (!overlay || typeof overlay === 'object' && !overlay.nodeType) {
    options = overlayOrOptions || {};
    overlay = root.querySelector('[data-add-child-overlay]') || root.querySelector('.add-child-overlay');
  }

  if (!overlay) {
    overlay = createAddChildOverlay(options);
    root.append(overlay);
  }

  button.addEventListener('click', () => {
    overlay.hidden = false;
  });

  if (typeof options.onSave === 'function') {
    overlay.addEventListener('child-saved', options.onSave);
  }

  return overlay;
}

export function childCardHtml(child, compact = false) {
  const photo =
    child?.photo_url ||
    child?.photoUrl ||
    child?.photo ||
    ASSETS.inactiveChildPhoto ||
    FALLBACKS.child;

  const name = child?.name || 'Child';
  const age = child?.age ? `${child.age} years old` : '';

  return `
    <article class="child-card ${compact ? 'child-card--compact' : ''}" data-child-id="${esc(child?.id || '')}">
      <div class="child-card-photo-wrap">
        <img
          src="${photo}"
          alt="${esc(name)}"
          class="child-card-photo"
        />
      </div>

      <div class="child-card-divider"></div>

      <div class="child-card-meta ${compact ? 'child-card-meta--compact' : ''}">
        <h3 class="child-name">${esc(name)}</h3>
        <p class="child-age">${esc(age)}</p>

        <button
          type="button"
          class="child-open-map-btn ${compact ? 'child-open-map-btn--compact' : ''}"
          data-open-body="${esc(child?.id || '')}"
        >
          Open Body Map
        </button>
      </div>
    </article>
  `;
}

export function wireChildCards(root = document) {
  root.querySelectorAll('[data-open-body]').forEach((button) => {
    button.addEventListener('click', () => {
      const childId = button.dataset.openBody;

      if (childId) setActiveChild(childId);

      window.location.hash = '#body-map';
    });
  });
}

export function childContextHtml(child = getActiveChild()) {
  if (!child) return '';

  const photo =
    child.photo_url ||
    child.photoUrl ||
    child.photo ||
    ASSETS.inactiveChildPhoto ||
    FALLBACKS.child;

  return `
    <section class="child-context-card">
      <img
        src="${photo}"
        alt="${esc(child.name || 'Child')}"
        class="child-context-photo"
      />

      <div class="child-context-details">
        <strong>${esc(child.name || 'Child')}</strong>
        ${child.age ? `<span>${esc(child.age)} years old</span>` : ''}
      </div>
    </section>
  `;
}

export function formatZones(zones = []) {
  if (!Array.isArray(zones) || zones.length === 0) {
    return 'No body area selected';
  }

  return zones
    .map((zone) => {
      if (typeof zone === 'string') {
        return zone
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }

      const value =
        zone.label ||
        zone.zoneLabel ||
        zone.zone_id ||
        zone.id ||
        'Pain area';

      return String(value)
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    })
    .join(', ');
}
