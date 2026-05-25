import { createAddChildOverlay } from '../components/addChildOverlay';
import { appState } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, childCardHtml, wireChildCards, wireAddChildOverlay } from '../sharedUi';

export function renderChildAddedScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen child-added-screen page-animate-in';
  const children = appState.children;
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('')}
    <section class="child-added-intro"><h1 class="children-title children-title--small">Your Children</h1></section>
    <section class="child-card-list ${children.length > 1 ? 'child-card-list--two' : ''}">
      ${children.length ? children.map(c => childCardHtml(c, children.length > 1)).join('') : '<p class="empty-state">Tap + to add a child.</p>'}
    </section>
    <button type="button" class="floating-add-btn" aria-label="Add child"><svg width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="59" cy="58" r="50" fill="#FF6F61" filter="drop-shadow(0px 2px 9px rgba(0,0,0,0.25))"/><line x1="59" y1="38" x2="59" y2="78" stroke="white" stroke-width="12" stroke-linecap="round"/><line x1="39" y1="58" x2="79" y2="58" stroke="white" stroke-width="12" stroke-linecap="round"/></svg></button>
    ${bottomNavHtml('home')}
  `);
  const overlay = createAddChildOverlay();
  screen.append(overlay);
  wireChildCards(screen);
  wireAddChildOverlay(screen, overlay, { onSave: () => renderChildAddedScreen(app) });
  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
