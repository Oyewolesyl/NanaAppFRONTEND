import { ASSETS } from './assets';
import { appState, getActiveChild, setActiveChild, saveChild } from './appState';
import { showToast } from './toast';

function getCurrentRoute() {
  return window.location.hash || '#child-added';
}

function getBottomNavActive(active) {
  if (active) return active;
  const route = getCurrentRoute();
  if (route === '#history') return 'history';
  if (route === '#assistant') return 'assistant';
  if (route === '#settings' || route === '#manage-children') return 'settings';
  return 'home';
}

export function escapeHtml(value = '', fallback = '') {
  return String(value ?? fallback)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function headerHtml(title = '', menu = true) {
  const safeTitle = escapeHtml(title);
  return `
    <header class="children-header">
      <img src="${ASSETS.logoMark}" alt="Nana logo" class="children-header-logo" />
      ${title ? `<strong class="mini-header-title">${safeTitle}</strong>` : ''}
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
      <button type="button" class="bottom-nav-item bottom-nav-item--assistant ${current === 'assistant' ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'}" data-nav="#assistant" aria-label="Nana Assistant" aria-current="${current === 'assistant' ? 'page' : 'false'}"><img src="${ASSETS.logoMark}" alt="" class="bottom-nav-logo" /></button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings ${current === 'settings' ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'}" data-nav="#settings" aria-label="Settings" aria-current="${current === 'settings' ? 'page' : 'false'}"><img src="${current === 'settings' ? ASSETS.navSettingsActive : ASSETS.navSettingsInactive}" alt="" /></button>
    </nav>
  `;
}

export function wireBottomNav(root) {
  const nav = root.querySelector('.bottom-nav');

  if (nav) {
    // The nav is rendered with the screen for readability, then promoted to the
    // body for fixed positioning. This prevents route containers from clipping
    // the nav on small mobile screens.
    document.querySelectorAll('body > .bottom-nav').forEach((node) => {
      if (node !== nav) node.remove();
    });

    if (nav.parentElement !== document.body) {
      document.body.append(nav);
    }
  }

  document.querySelectorAll('.bottom-nav [data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const destination = btn.dataset.nav;
      if (destination) window.location.hash = destination;
    });
  });
}

export function attachMenu(root) {
  const btn = root.querySelector('.children-menu-button');
  if (!btn) return;
  const header = btn.closest('.children-header');

  if (header) {
    // Same pattern as bottom nav: keep screen modules declarative while the
    // shared helper handles the fixed mobile placement.
    document.querySelectorAll('body > .children-header').forEach((node) => {
      if (node !== header) node.remove();
    });

    root.classList.add('screen--body-header');

    if (header.parentElement !== document.body) {
      document.body.append(header);
    }
  }

  const overlay = document.createElement('div');
  overlay.className = 'nana-menu-overlay';
  overlay.hidden = true;
  const child = getActiveChild();
  const childName = escapeHtml(child?.name || '');
  overlay.innerHTML = `
    <div class="nana-menu-backdrop" data-close-menu></div>
    <aside class="nana-menu-panel">
      <div class="nana-menu-top"><img src="${ASSETS.splashHeaderLogo}" alt="Nana" /><button type="button" data-close-menu aria-label="Close menu">×</button></div>
      <p class="nana-menu-context">${child ? `Current child: ${childName}` : 'Manage Nana'}</p>
      <button type="button" data-menu-nav="#child-added">Home</button>
      <button type="button" data-menu-nav="#assistant">Nana Assistant</button>
      <button type="button" data-menu-nav="#manage-children">Manage Children</button>
      <button type="button" data-menu-nav="#history">History</button>
      <button type="button" data-menu-nav="#settings">Caregiver Settings</button>
      <button type="button" data-menu-nav="#select-role">Switch Role</button>
    </aside>`;
  document.querySelectorAll('body > .nana-menu-overlay').forEach((node) => node.remove());
  document.body.append(overlay);
  btn.addEventListener('click', () => { overlay.hidden = false; });
  overlay.querySelectorAll('[data-close-menu]').forEach((node) => node.addEventListener('click', () => { overlay.hidden = true; }));
  overlay.querySelectorAll('[data-menu-nav]').forEach((node) => node.addEventListener('click', () => { overlay.hidden = true; window.location.hash = node.dataset.menuNav; }));
}

export function childCardHtml(child, compact = false, options = {}) {
  const showEdit = Boolean(options.showEdit);
  const childId = escapeHtml(child.id || '');
  const childPhoto = escapeHtml(child.photo_url || ASSETS.inactiveChildPhoto);
  const childName = escapeHtml(child.name || 'Child');
  const childAge = child.age ? `${escapeHtml(child.age)} years old` : '';

  return `
    <article class="child-card ${compact ? 'child-card--compact' : ''}" data-child-id="${childId}">
      ${showEdit ? `<button type="button" class="child-edit-profile-btn" data-edit-child aria-label="Edit ${childName}">Edit</button>` : ''}

      <div class="child-card-photo-wrap">
        <img src="${childPhoto}" alt="${childName}" class="child-card-photo" />
      </div>

      <div class="child-card-meta ${compact ? 'child-card-meta--compact' : ''}">
        <p class="child-name">${childName}</p>
        <p class="child-age">${childAge}</p>
      </div>

      <button type="button" class="child-open-map-btn ${compact ? 'child-open-map-btn--compact' : ''}">
        Open Body Map
      </button>
    </article>`;
}

export function wireChildCards(root) {
  stabilizeChildCardLayout(root);

  root.querySelectorAll('[data-child-id]').forEach((card) => {
    card.querySelector('.child-open-map-btn')?.addEventListener('click', () => {
      setActiveChild(card.dataset.childId);
      window.location.hash = '#body-map';
    });
  });
}

function stabilizeChildCardLayout(root) {
  // Final handover guard: the project has several historical mobile overrides
  // for the child cards. These inline-important values keep the launch cards
  // readable and centered across small Safari/Chrome viewports.
  root.querySelectorAll('.child-card-list').forEach((list) => {
    list.style.setProperty('box-sizing', 'border-box', 'important');
    list.style.setProperty('width', '100%', 'important');
    list.style.setProperty('max-width', '390px', 'important');
    list.style.setProperty('margin-left', 'auto', 'important');
    list.style.setProperty('margin-right', 'auto', 'important');
    list.style.setProperty('padding-left', '0', 'important');
    list.style.setProperty('padding-right', '0', 'important');
    list.style.setProperty('grid-template-columns', 'minmax(0, 292px)', 'important');
    list.style.setProperty('justify-content', 'center', 'important');
    list.style.setProperty('justify-items', 'center', 'important');
  });

  root.querySelectorAll('.child-card').forEach((card) => {
    card.style.setProperty('box-sizing', 'border-box', 'important');
    card.style.setProperty('width', '292px', 'important');
    card.style.setProperty('max-width', 'calc(100vw - 52px)', 'important');
    card.style.setProperty('min-height', '252px', 'important');
    card.style.setProperty('padding', '22px 20px 20px', 'important');
    card.style.setProperty('display', 'grid', 'important');
    card.style.setProperty('grid-template-columns', 'minmax(0, 1fr)', 'important');
    card.style.setProperty('justify-items', 'center', 'important');
    card.style.setProperty('align-content', 'center', 'important');
    card.style.setProperty('gap', '10px', 'important');
    card.style.setProperty('margin-left', 'auto', 'important');
    card.style.setProperty('margin-right', 'auto', 'important');
    card.style.setProperty('place-self', 'center', 'important');

    const button = card.querySelector('.child-open-map-btn');
    if (!button) return;
    button.style.setProperty('box-sizing', 'border-box', 'important');
    button.style.setProperty('grid-column', '1 / -1', 'important');
    button.style.setProperty('justify-self', 'center', 'important');
    button.style.setProperty('width', '246px', 'important');
    button.style.setProperty('min-width', '246px', 'important');
    button.style.setProperty('max-width', '246px', 'important');
    button.style.setProperty('height', '46px', 'important');
    button.style.setProperty('min-height', '46px', 'important');
    button.style.setProperty('max-height', '46px', 'important');
    button.style.setProperty('margin', '0 auto', 'important');
    button.style.setProperty('padding', '0 18px', 'important');
    button.style.setProperty('display', 'inline-flex', 'important');
    button.style.setProperty('align-items', 'center', 'important');
    button.style.setProperty('justify-content', 'center', 'important');
    button.style.setProperty('font-size', '15px', 'important');
    button.style.setProperty('line-height', '1', 'important');
    button.style.setProperty('white-space', 'nowrap', 'important');
  });
}

export function wireAddChildOverlay(root, overlay, { onSave } = {}) {
  document.querySelectorAll('body > .add-child-overlay').forEach((node) => {
    if (node !== overlay) node.remove();
  });

  if (overlay.parentElement !== document.body) {
    document.body.append(overlay);
  }

  function openOverlay(child = null) {
    // resetForm receives either an existing child for edit mode or null for a
    // fresh child. The overlay owns its temporary form state until Save.
    overlay.resetForm?.(child);
    document.body.classList.add('nana-add-child-open');
    overlay.hidden = false;
    overlay.classList.remove('add-child-overlay--closing');
    overlay.classList.add('add-child-overlay--opening');
  }

  function hideOverlay(removeFromDom = false) {
    document.body.classList.remove('nana-add-child-open');
    overlay.hidden = true;
    overlay.classList.remove('add-child-overlay--opening', 'add-child-overlay--closing');
    if (removeFromDom) overlay.remove();
  }

  root.querySelectorAll('.children-add-button,.floating-add-btn,[data-add-child]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openOverlay();
    });
  });

  root.querySelectorAll('[data-edit-child]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = btn.closest('[data-child-id]')?.dataset.childId;
      const child = appState.children.find(c => c.id === id);
      openOverlay(child);
    });
  });

  overlay.querySelectorAll('[data-close-overlay="true"]').forEach((node) => {
    node.addEventListener('click', () => {
      overlay.classList.remove('add-child-overlay--opening');
      overlay.classList.add('add-child-overlay--closing');
      setTimeout(() => {
        hideOverlay();
      }, 180);
    });
  });

  overlay.querySelector('.save-child-button')?.addEventListener('click', () => {
    const rawName = overlay.querySelector('[data-child-name]')?.value?.trim();
    const editingId = overlay.dataset.editChildId || '';
    const isEditing = Boolean(editingId);
    const existing = editingId ? appState.children.find(c => c.id === editingId) : null;
    const name = rawName || existing?.name || `Child ${appState.children.length + 1}`;
    const age = Number(overlay.querySelector('.age-wheel-item.is-selected')?.dataset.age || existing?.age || '4');
    const photo_url = overlay.dataset.photoUrl || existing?.photo_url || ASSETS.inactiveChildPhoto;
    const saved = saveChild({ id: editingId || undefined, name, age, photo_url });
    hideOverlay(true);
    onSave?.(saved);
    showToast(isEditing ? 'Child profile updated' : 'Child added');
    window.dispatchEvent(new CustomEvent('nana:children-updated', { detail: saved }));
  });
}

export function childContextHtml() {
  const child = getActiveChild();
  if (!child) return '';
  return `<div class="child-context-pill"><img src="${escapeHtml(child.photo_url || ASSETS.inactiveChildPhoto)}" alt="" /><span>For ${escapeHtml(child.name)}</span></div>`;
}

export function prettyZone(zone = '') {
  return String(zone).replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatZones(zones = []) {
  return zones.length ? zones.map(prettyZone).join(', ') : 'No spot selected';
}

export function painProgressHtml(activeStep = 1) {
  const steps = ['Spot', 'Feel', 'Time', 'Level', 'Review'];

  return `
    <nav class="pain-progress" aria-label="Pain report progress">
      ${steps.map((label, index) => {
        const step = index + 1;
        const state = step < activeStep ? 'is-complete' : step === activeStep ? 'is-active' : '';
        return `<span class="${state}"><i>${step}</i><em>${label}</em></span>`;
      }).join('')}
    </nav>
  `;
}
