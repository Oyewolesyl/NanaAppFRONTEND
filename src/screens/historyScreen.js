import { appState } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, formatZones } from '../sharedUi';

export function renderHistoryScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen history-screen';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('History')}
    <section class="settings-content history-content">
      <h1 class="children-title children-title--small">Pain History</h1>
      <div class="history-list">
        ${appState.painLogs.length ? appState.painLogs.map(log => `<article class="history-card"><strong>${log.childName}</strong><span>${new Date(log.created_at).toLocaleString()}</span><p>${formatZones(log.zones)}</p><p>${log.painType || 'Pain'} • ${log.intensity ?? '-'} / 10</p></article>`).join('') : '<p class="empty-state">No pain records yet. Submit a pain report and it will appear here.</p>'}
      </div>
    </section>
    ${bottomNavHtml('history')}
  `);
  wireBottomNav(screen); attachMenu(screen); app.append(screen);
}
