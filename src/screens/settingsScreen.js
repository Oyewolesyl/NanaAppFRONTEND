import { appState, updateCaregiver } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, escapeHtml } from '../sharedUi';

export function renderSettingsScreen(app) {
  app.innerHTML = '';

  const c = appState.caregiver;
  const caregiverName = escapeHtml(c.name || 'Caregiver');
  const caregiverNameValue = escapeHtml(c.name || '');
  const caregiverEmail = escapeHtml(c.email || '');
  const caregiverPhone = escapeHtml(c.phone || '');
  const screen = document.createElement('main');
  screen.className = 'screen settings-screen mobile-fit-screen page-animate-in';

  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('Settings')}

    <section class="settings-content settings-content-fit">
      <h1 class="children-title children-title--small">Caregiver Profile</h1>
      <section class="settings-summary-card">
        <span>Launch profile</span>
        <strong>${caregiverName}</strong>
        <p>${appState.children.length} child profile${appState.children.length === 1 ? '' : 's'} connected. ${appState.painLogs.length} pain report${appState.painLogs.length === 1 ? '' : 's'} saved.</p>
      </section>

      <div class="settings-field">
        <span class="settings-field-label">Name</span>
        <input data-caregiver-name value="${caregiverNameValue}" placeholder="Your name" />
      </div>

      <div class="settings-field">
        <span class="settings-field-label">Email</span>
        <input type="email" inputmode="email" autocomplete="email" data-caregiver-email value="${caregiverEmail}" placeholder="you@email.com" />
      </div>

      <div class="settings-field">
        <span class="settings-field-label">Phone</span>
        <input type="tel" inputmode="tel" autocomplete="tel" data-caregiver-phone value="${caregiverPhone}" placeholder="Phone number" />
      </div>

      <button type="button" class="continue-button save-settings">Save Profile</button>
      <button type="button" class="settings-link settings-link--assistant" data-go-assistant>Nana Assistant</button>
      <button type="button" class="settings-link" data-go-manage>Manage Children</button>
      <button type="button" class="settings-link" data-go-history>View History</button>
    </section>

    ${bottomNavHtml('settings')}
  `);

  screen.querySelector('.save-settings').addEventListener('click', () => {
    updateCaregiver({
      name: screen.querySelector('[data-caregiver-name]').value,
      email: screen.querySelector('[data-caregiver-email]').value,
      phone: screen.querySelector('[data-caregiver-phone]').value
    });

    screen.querySelector('.save-settings').textContent = 'Saved';
    setTimeout(() => {
      screen.querySelector('.save-settings').textContent = 'Save Profile';
    }, 900);
  });

  screen.querySelector('[data-go-manage]').addEventListener('click', () => {
    window.location.hash = '#manage-children';
  });

  screen.querySelector('[data-go-assistant]').addEventListener('click', () => {
    window.location.hash = '#assistant';
  });

  screen.querySelector('[data-go-history]').addEventListener('click', () => {
    window.location.hash = '#history';
  });

  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
