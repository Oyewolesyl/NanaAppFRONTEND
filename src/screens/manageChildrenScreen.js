import { createAddChildOverlay } from '../components/addChildOverlay';
import { appState, removeChild, setActiveChild } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, wireAddChildOverlay, escapeHtml } from '../sharedUi';
import { ASSETS } from '../assets';
import { showToast } from '../toast';

function card(child) {
  const childId = escapeHtml(child.id || '');
  const childName = escapeHtml(child.name || 'Child');
  const childPhoto = escapeHtml(child.photo_url || ASSETS.inactiveChildPhoto);
  const childAge = escapeHtml(child.age || '-');

  return `<article class="manage-child-card" data-child-id="${childId}">
    <img src="${childPhoto}" alt="${childName}" />
    <div><strong>${childName}</strong><span>${childAge} years old</span></div>
    <button type="button" data-edit-child>Edit Profile</button>
    <button type="button" data-open-child>Body Map</button>
    <button type="button" data-remove-child>Remove</button>
  </article>`;
}

export function renderManageChildrenScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen manage-screen page-animate-in';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('Manage Children')}
    <section class="settings-content manage-content">
      <h1 class="children-title children-title--small">Manage Children</h1>
      <button type="button" class="continue-button manage-add" data-add-child>Add Child</button>
      <div class="manage-list">${appState.children.map(card).join('') || '<p class="empty-state">No children added yet.</p>'}</div>
    </section>
    ${bottomNavHtml('settings')}
  `);
  const overlay = createAddChildOverlay();
  screen.append(overlay);
  wireAddChildOverlay(screen, overlay, { onSave: () => renderManageChildrenScreen(app) });
  wireBottomNav(screen);
  attachMenu(screen);
  screen.querySelectorAll('[data-open-child]').forEach(btn => btn.addEventListener('click', () => {
    setActiveChild(btn.closest('[data-child-id]').dataset.childId);
    window.location.hash = '#body-map';
  }));
  screen.querySelectorAll('[data-remove-child]').forEach(btn => btn.addEventListener('click', () => {
    const cardNode = btn.closest('[data-child-id]');
    const child = appState.children.find((item) => item.id === cardNode.dataset.childId);
    if (!window.confirm(`Remove ${child?.name || 'this child'} and their pain history from this device?`)) return;
    removeChild(cardNode.dataset.childId);
    renderManageChildrenScreen(app);
    showToast('Child removed');
  }));
  app.append(screen);
}
