import { appState } from '../appState';
import { headerHtml, bottomNavHtml, wireBottomNav, attachMenu, formatZones } from '../sharedUi';

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - day);
  return d;
}
function groupLogs(logs) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const groups = { today: [], week: [], earlier: [] };
  logs.forEach(log => {
    const date = new Date(log.created_at || Date.now());
    if (isSameDay(date, now)) groups.today.push(log);
    else if (date >= weekStart) groups.week.push(log);
    else groups.earlier.push(log);
  });
  return groups;
}
function historyCard(log) {
  const date = new Date(log.created_at || Date.now());
  return `<article class="history-card history-record-card">
    <div class="history-record-top"><strong>${log.childName || 'Child'}</strong><span>${date.toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span></div>
    <div class="history-record-meta"><span>${log.painType || 'Pain'}</span><span>${log.intensity ?? '-'} / 10</span></div>
    <p class="history-record-zones">${formatZones(log.zones)}</p>
    ${log.notes ? `<p class="history-record-note">Note: ${log.notes}</p>` : ''}
  </article>`;
}
function groupHtml(title, logs) {
  if (!logs.length) return '';
  return `<section class="history-group"><h2>${title}</h2><div class="history-group-list">${logs.map(historyCard).join('')}</div></section>`;
}

export function renderHistoryScreen(app) {
  app.innerHTML = '';
  const groups = groupLogs(appState.painLogs);
  const screen = document.createElement('main');
  screen.className = 'screen children-screen history-screen page-animate-in';
  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('History')}
    <section class="settings-content history-content">
      <h1 class="children-title children-title--small">Pain History</h1>
      <div class="history-list history-timeline">
        ${appState.painLogs.length ? `${groupHtml('Today', groups.today)}${groupHtml('This Week', groups.week)}${groupHtml('Earlier', groups.earlier)}` : '<p class="empty-state">No pain records yet. Submit a pain report and it will appear here.</p>'}
      </div>
    </section>
    ${bottomNavHtml('history')}
  `);
  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
