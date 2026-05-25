import { appState } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, formatZones } from '../sharedUi';

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isThisWeek(date) {
  const now = new Date();
  const today = startOfDay(now);
  const day = today.getDay() || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  return date >= monday && date < nextMonday;
}

function groupLogs(logs) {
  const groups = { Today: [], 'This Week': [], Earlier: [] };
  const today = startOfDay(new Date());
  logs.forEach((log) => {
    const d = new Date(log.created_at);
    if (startOfDay(d).getTime() === today.getTime()) groups.Today.push(log);
    else if (isThisWeek(d)) groups['This Week'].push(log);
    else groups.Earlier.push(log);
  });
  return groups;
}

function historyCard(log) {
  const zones = Array.isArray(log.zones) ? log.zones : [];
  const notes = log.notes?.trim();
  return `
    <article class="history-card">
      <div class="history-card-top">
        <strong>${log.childName || 'Child'}</strong>
        <span>${new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
      </div>
      <p><b>Spots:</b> ${formatZones(zones)}</p>
      <p><b>Feels like:</b> ${log.painType || 'Not chosen'} • <b>Pain:</b> ${log.intensity ?? '-'} / 10</p>
      ${notes ? `<p class="history-note"><b>Note:</b> ${notes}</p>` : ''}
    </article>
  `;
}

export function renderHistoryScreen(app) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen children-screen history-screen';
  const groups = groupLogs(appState.painLogs);
  const body = appState.painLogs.length
    ? Object.entries(groups).map(([label, logs]) => logs.length ? `
        <section class="history-group">
          <h2 class="history-group-title">${label}</h2>
          ${logs.map(historyCard).join('')}
        </section>
      ` : '').join('')
    : '<p class="empty-state">No pain records yet. Submit a pain report and it will appear here.</p>';

  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('History')}
    <section class="settings-content history-content">
      <h1 class="children-title children-title--small">Pain History</h1>
      <div class="history-list">${body}</div>
    </section>
    ${bottomNavHtml('history')}
  `);
  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
