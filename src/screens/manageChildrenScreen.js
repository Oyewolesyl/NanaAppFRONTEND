import { createAddChildOverlay } from '../components/addChildOverlay';
import { appState, removeChild, setActiveChild } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, wireAddChildOverlay } from '../sharedUi';

export function renderManageChildrenScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen manage-screen';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('Manage Children')}
    <section class="settings-content manage-content">
      <h1 class="children-title children-title--small">Manage Children</h1>
      <button type="button" class="continue-button manage-add" data-add-child>Add Child</button>
      <div class="manage-list">
        ${appState.children.map(child => `<article class="manage-child-card" data-child-id="${child.id}">
          <img src="${child.photo_url}" alt="${child.name}" />
          <div><strong>${child.name}</strong><span>${child.age} years old</span></div>
          <button type="button" data-open-child>Body Map</button>
          <button type="button" data-edit-child>Edit</button>
          <button type="button" data-remove-child>Remove</button>
        </article>`).join('') || '<p class="empty-state">No children added yet.</p>'}
      </div>
    </section>
    ${bottomNavHtml('settings')}
  `);
  const overlay = createAddChildOverlay(); screen.append(overlay);
  wireAddChildOverlay(screen, overlay, () => renderManageChildrenScreen(app)); wireBottomNav(screen); attachMenu(screen);
  screen.querySelectorAll('[data-edit-child]').forEach(btn => btn.addEventListener('click', () => { const child = appState.children.find(c => c.id === btn.closest('[data-child-id]').dataset.childId); overlay.openForChild?.(child); overlay.afterSave = () => renderManageChildrenScreen(app); }));
  screen.querySelectorAll('[data-open-child]').forEach(btn => btn.addEventListener('click', () => { setActiveChild(btn.closest('[data-child-id]').dataset.childId); window.location.hash = '#body-map'; }));
  screen.querySelectorAll('[data-remove-child]').forEach(btn => btn.addEventListener('click', () => { removeChild(btn.closest('[data-child-id]').dataset.childId); renderManageChildrenScreen(app); }));
  app.append(screen);
}
