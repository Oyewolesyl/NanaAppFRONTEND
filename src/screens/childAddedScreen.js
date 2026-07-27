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
    <section class="home-assistant-strip">
      <div>
        <span>Nana Assistant</span>
        <strong>Turn saved pain reports into a care plan.</strong>
      </div>
      <button type="button" data-open-assistant>Open</button>
    </section>
    <section class="child-card-list" data-safe-child-list>
      ${children.length ? children.map(c => childCardHtml(c, false)).join('') : '<p class="empty-state">Tap + to add a child.</p>'}
    </section>
    <button type="button" class="floating-add-btn" aria-label="Add child"><svg width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="59" cy="58" r="50" fill="#FF6F61" filter="drop-shadow(0px 2px 9px rgba(0,0,0,0.25))"/><line x1="59" y1="38" x2="59" y2="78" stroke="white" stroke-width="12" stroke-linecap="round"/><line x1="39" y1="58" x2="79" y2="58" stroke="white" stroke-width="12" stroke-linecap="round"/></svg></button>
    ${bottomNavHtml('home')}
  `);
  const addButton = screen.querySelector('.floating-add-btn');
  screen.querySelector('[data-open-assistant]')?.addEventListener('click', () => {
    window.location.hash = '#assistant';
  });
  const childList = screen.querySelector('[data-safe-child-list]');
  childList?.classList.remove('child-card-list--two');
  childList?.style.setProperty('display', 'grid', 'important');
  childList?.style.setProperty('grid-template-columns', 'minmax(0, min(270px, 78vw))', 'important');
  childList?.style.setProperty('justify-content', 'center', 'important');
  childList?.style.setProperty('justify-items', 'center', 'important');
  childList?.style.setProperty('gap', '16px', 'important');
  childList?.style.setProperty('width', '100%', 'important');
  childList?.querySelectorAll('.child-card').forEach((card) => {
    card.classList.remove('child-card--compact');
    card.style.setProperty('width', '100%', 'important');
    card.style.setProperty('max-width', 'min(270px, 78vw)', 'important');
    card.style.setProperty('margin', '0', 'important');
    card.style.setProperty('transform', 'none', 'important');
  });
  addButton.style.position = 'fixed';
  addButton.style.right = '18px';
  addButton.style.bottom = 'calc(var(--nana-bottom-nav-height, 92px) + env(safe-area-inset-bottom, 0px) + 20px)';
  addButton.style.zIndex = '2147483001';
  const overlay = createAddChildOverlay();
  screen.append(overlay);
  wireChildCards(screen);
  wireAddChildOverlay(screen, overlay, { onSave: () => renderChildAddedScreen(app) });
  document.querySelectorAll('body > .floating-add-btn').forEach((node) => {
    if (node !== addButton) node.remove();
  });
  document.body.append(addButton);
  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
