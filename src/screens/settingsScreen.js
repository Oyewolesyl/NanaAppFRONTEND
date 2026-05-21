import { appState, updateCaregiver } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu } from '../sharedUi';

export function renderSettingsScreen(app) {
  app.innerHTML = '';
  const c = appState.caregiver;
  const screen = document.createElement('main');
  screen.className = 'screen children-screen settings-screen';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('Settings')}
    <section class="settings-content">
      <h1 class="children-title children-title--small">Caregiver Profile</h1>
      <label class="settings-field">Name<input data-caregiver-name value="${c.name || ''}" placeholder="Your name" /></label>
      <label class="settings-field">Email<input data-caregiver-email value="${c.email || ''}" placeholder="you@email.com" /></label>
      <label class="settings-field">Phone<input data-caregiver-phone value="${c.phone || ''}" placeholder="Phone number" /></label>
      <button type="button" class="continue-button save-settings">Save Profile</button>
      <button type="button" class="settings-link" data-go-manage>Manage Children</button>
      <button type="button" class="settings-link" data-go-history>View History</button>
      <p class="settings-note">Child details are managed under Manage Children. This page is for the caregiver account.</p>
    </section>
    ${bottomNavHtml('settings')}
  `);
  screen.querySelector('.save-settings').addEventListener('click', () => {
    updateCaregiver({ name: screen.querySelector('[data-caregiver-name]').value, email: screen.querySelector('[data-caregiver-email]').value, phone: screen.querySelector('[data-caregiver-phone]').value });
    screen.querySelector('.save-settings').textContent = 'Saved';
    setTimeout(() => { screen.querySelector('.save-settings').textContent = 'Save Profile'; }, 900);
  });
  screen.querySelector('[data-go-manage]').addEventListener('click', () => { window.location.hash = '#manage-children'; });
  screen.querySelector('[data-go-history]').addEventListener('click', () => { window.location.hash = '#history'; });
  wireBottomNav(screen); attachMenu(screen); app.append(screen);
}
