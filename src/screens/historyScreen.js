import { appState } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, formatZones } from '../sharedUi';

function startOfDay(date) { const d = new Date(date); d.setHours(0,0,0,0); return d; }
function groupLogs(logs) {
  const today = startOfDay(new Date()).getTime();
  const weekAgo = today - 6 * 24 * 60 * 60 * 1000;
  return {
    Today: logs.filter(log => startOfDay(log.created_at).getTime() === today),
    'This Week': logs.filter(log => { const t = startOfDay(log.created_at).getTime(); return t < today && t >= weekAgo; }),
    Earlier: logs.filter(log => startOfDay(log.created_at).getTime() < weekAgo),
  };
}

function historyCard(log) {
  const time = new Date(log.created_at).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
  return `<article class="history-card history-card--rich">
    <div class="history-card-top"><div><strong>${log.childName}</strong><span>${time}</span></div><b>${log.intensity ?? '-'} / 10</b></div>
    <p class="history-zones">${formatZones(log.zones)}</p>
    <div class="history-tags"><span>${log.painType || 'Pain type not chosen'}</span><span>${log.started || 'Start not chosen'}</span><span>${(log.zones || []).length} spot${(log.zones || []).length === 1 ? '' : 's'}</span></div>
    ${log.notes ? `<p class="history-note">“${log.notes}”</p>` : ''}
  </article>`;
}

export function renderHistoryScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen history-screen';
  const groups = groupLogs(appState.painLogs || []);
  const body = appState.painLogs.length
    ? Object.entries(groups).map(([label, logs]) => logs.length ? `<section class="history-group"><h2>${label}</h2>${logs.map(historyCard).join('')}</section>` : '').join('')
    : '<p class="empty-state">No pain records yet. Submit a pain report and it will appear here.</p>';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('History')}
    <section class="settings-content history-content history-content--rich">
      <h1 class="children-title children-title--small">Pain History</h1>
      <p class="children-subtitle">Recent records grouped so the caregiver can scan them fast.</p>
      <div class="history-list history-list--grouped">${body}</div>
    </section>
    ${bottomNavHtml('history')}
  `);
  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
