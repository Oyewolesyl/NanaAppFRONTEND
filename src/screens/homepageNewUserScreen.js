import { ASSETS } from '../assets';
import { createAddChildOverlay } from '../components/addChildOverlay';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, wireAddChildOverlay } from '../sharedUi';

export function renderHomepageNewUserScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('')}
    <section class="children-intro">
      <h1 class="children-title">Your Children</h1>
      <p class="children-subtitle">will be listed here</p>
    </section>
    <section class="children-add-section">
      <h2 class="children-add-title">Tap to add a Child</h2>
      <button type="button" class="children-add-button" aria-label="Add child"><svg width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="59" cy="58" r="50" fill="#FF6F61" filter="drop-shadow(0px 2px 9px rgba(0,0,0,0.25))"/><line x1="59" y1="38" x2="59" y2="78" stroke="white" stroke-width="12" stroke-linecap="round"/><line x1="39" y1="58" x2="79" y2="58" stroke="white" stroke-width="12" stroke-linecap="round"/></svg></button>
    </section>
    ${bottomNavHtml('home')}
  `);
  const overlay = createAddChildOverlay();
  screen.append(overlay);
  wireAddChildOverlay(screen, overlay);
  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
