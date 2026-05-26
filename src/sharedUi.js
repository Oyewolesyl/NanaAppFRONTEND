import { ASSETS } from './assets';
import { appState, getActiveChild, setActiveChild, saveChild } from './appState';

function getCurrentRoute() {
  return window.location.hash || '#child-added';
}

function getBottomNavActive(active) {
  if (active) return active;
  const route = getCurrentRoute();
  if (route === '#history') return 'history';
  if (route === '#settings' || route === '#manage-children') return 'settings';
  return 'home';
}

export function headerHtml(title = '', menu = true) {
  return `
    <header class="children-header">
      <img src="${ASSETS.splashHeaderLogo}" alt="Nana logo" class="children-header-logo" />
      ${title ? `<strong class="mini-header-title">${title}</strong>` : ''}
      ${menu ? `<button type="button" aria-label="Open menu" class="children-menu-button"><img src="${ASSETS.splashMenuIcon}" alt="" /></button>` : ''}
    </header>
  `;
}

export function bottomNavHtml(active = '') {
  const current = getBottomNavActive(active);
  return `
    <nav class="bottom-nav" aria-label="Main navigation" data-active="${current}">
      <button type="button" class="bottom-nav-item bottom-nav-item--home ${current === 'home' ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'}" data-nav="#child-added" aria-label="Home" aria-current="${current === 'home' ? 'page' : 'false'}"><img src="${ASSETS.navHome}" alt="" /></button>
      <button type="button" class="bottom-nav-item bottom-nav-item--activity ${current === 'history' ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'}" data-nav="#history" aria-label="History" aria-current="${current === 'history' ? 'page' : 'false'}"><img src="${current === 'history' ? ASSETS.navHistoryActive : ASSETS.navClock}" alt="" /></button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings ${current === 'settings' ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'}" data-nav="#settings" aria-label="Settings" aria-current="${current === 'settings' ? 'page' : 'false'}"><img src="${current === 'settings' ? ASSETS.navSettingsActive : ASSETS.navSettingsInactive}" alt="" /></button>
    </nav>
  `;
}

export function wireBottomNav(root) {
  root.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const destination = btn.dataset.nav;
      if (destination) window.location.hash = destination;
    });
  });
}

export function attachMenu(root) {
  const btn = root.querySelector('.children-menu-button');
  if (!btn) return;
  const overlay = document.createElement('div');
  overlay.className = 'nana-menu-overlay';
  overlay.hidden = true;
  const child = getActiveChild();
  overlay.innerHTML = `
    <div class="nana-menu-backdrop" data-close-menu></div>
    <aside class="nana-menu-panel">
      <div class="nana-menu-top"><img src="${ASSETS.splashHeaderLogo}" alt="Nana" /><button type="button" data-close-menu aria-label="Close menu">×</button></div>
      <p class="nana-menu-context">${child ? `Current child: ${child.name}` : 'Manage Nana'}</p>
      <button type="button" data-menu-nav="#child-added">Home</button>
      <button type="button" data-menu-nav="#manage-children">Manage Children</button>
      <button type="button" data-menu-nav="#history">History</button>
      <button type="button" data-menu-nav="#settings">Caregiver Settings</button>
      <button type="button" data-menu-nav="#select-role">Switch Role</button>
    </aside>`;
  root.append(overlay);
  btn.addEventListener('click', () => { overlay.hidden = false; });
  overlay.querySelectorAll('[data-close-menu]').forEach((node) => node.addEventListener('click', () => { overlay.hidden = true; }));
  overlay.querySelectorAll('[data-menu-nav]').forEach((node) => node.addEventListener('click', () => { overlay.hidden = true; window.location.hash = node.dataset.menuNav; }));
}

export function childCardHtml(child, compact = false) {
  return `
    <article class="child-card ${compact ? 'child-card--compact' : ''}" data-child-id="${child.id}">
      <button type="button" class="child-edit-profile-btn" data-edit-child aria-label="Edit ${child.name}">Edit</button>
      <div class="child-card-photo-wrap"><img src="${child.photo_url || ASSETS.inactiveChildPhoto}" alt="${child.name}" class="child-card-photo" /></div>
      <div class="child-card-divider"></div>
      <div class="child-card-meta ${compact ? 'child-card-meta--compact' : ''}"><p class="child-name">${child.name}</p><p class="child-age">${child.age} years old</p></div>
      <div class="child-card-divider"></div>
      <button type="button" class="child-open-map-btn ${compact ? 'child-open-map-btn--compact' : ''}">Open Body Map</button>
    </article>`;
}

export function wireChildCards(root) {
  root.querySelectorAll('[data-child-id]').forEach((card) => {
    card.querySelector('.child-open-map-btn')?.addEventListener('click', () => {
      setActiveChild(card.dataset.childId);
      window.location.hash = '#body-map';
    });
  });
}

export function wireAddChildOverlay(root, overlay, { onSave } = {}) {
  root.querySelectorAll('.children-add-button,.floating-add-btn,[data-add-child]').forEach((btn) => {
    btn.addEventListener('click', () => {
      overlay.resetForm?.();
      overlay.hidden = false;
      overlay.classList.remove('add-child-overlay--closing');
      overlay.classList.add('add-child-overlay--opening');
    });
  });

  root.querySelectorAll('[data-edit-child]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = btn.closest('[data-child-id]')?.dataset.childId;
      const child = appState.children.find(c => c.id === id);
      overlay.resetForm?.(child);
      overlay.hidden = false;
      overlay.classList.remove('add-child-overlay--closing');
      overlay.classList.add('add-child-overlay--opening');
    });
  });

  overlay.querySelectorAll('[data-close-overlay="true"]').forEach((node) => {
    node.addEventListener('click', () => {
      overlay.classList.remove('add-child-overlay--opening');
      overlay.classList.add('add-child-overlay--closing');
      setTimeout(() => {
        overlay.hidden = true;
        overlay.classList.remove('add-child-overlay--closing');
      }, 180);
    });
  });

  overlay.querySelector('.save-child-button')?.addEventListener('click', () => {
    const rawName = overlay.querySelector('[data-child-name]')?.value?.trim();
    const editingId = overlay.dataset.editChildId || '';
    const existing = editingId ? appState.children.find(c => c.id === editingId) : null;
    const name = rawName || existing?.name || `Child ${appState.children.length + 1}`;
    const age = Number(overlay.querySelector('.age-wheel-item.is-selected')?.dataset.age || existing?.age || '4');
    const photo_url = overlay.dataset.photoUrl || existing?.photo_url || ASSETS.inactiveChildPhoto;
    const saved = saveChild({ id: editingId || undefined, name, age, photo_url });
    overlay.hidden = true;
    overlay.classList.remove('add-child-overlay--opening', 'add-child-overlay--closing');
    onSave?.(saved);
    window.dispatchEvent(new CustomEvent('nana:children-updated', { detail: saved }));
  });
}

export function childContextHtml() {
  const child = getActiveChild();
  if (!child) return '';
  return `<div class="child-context-pill"><img src="${child.photo_url || ASSETS.inactiveChildPhoto}" alt="" /><span>For ${child.name}</span></div>`;
}

export function prettyZone(zone = '') {
  return String(zone).replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatZones(zones = []) {
  return zones.length ? zones.map(prettyZone).join(', ') : 'No spot selected';
}
