import { appState } from '../appState';
import {
  headerHtml,
  bottomNavHtml,
  wireBottomNav,
  attachMenu,
  formatZones
} from '../sharedUi';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;

  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);

  return d;
}

function groupLogs(logs) {
  const now = new Date();
  const weekStart = startOfWeek(now);

  const groups = {
    today: [],
    week: [],
    earlier: [],
  };

  logs.forEach((log) => {
    const date = new Date(log.created_at || Date.now());

    if (isSameDay(date, now)) {
      groups.today.push(log);
    } else if (date >= weekStart) {
      groups.week.push(log);
    } else {
      groups.earlier.push(log);
    }
  });

  return groups;
}

function getChildForLog(log) {
  return appState.children.find((item) => (
    item.id === log.childId ||
    item.id === log.child_id
  ));
}

function safeText(value, fallback = '') {
  const text = String(value ?? fallback);
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function historyCard(log) {
  const date = new Date(log.created_at || Date.now());
  const child = getChildForLog(log);

  const childName =
    child?.name ||
    log.childName ||
    log.child_name ||
    'Child';

  const childPhoto =
    child?.photo_url ||
    child?.photoUrl ||
    log.childPhoto ||
    log.child_photo ||
    '/inactivechildpicture.svg';

  const painType =
    log.painType ||
    log.pain_type ||
    'Pain';

  const intensity =
    log.intensity ??
    log.pain_scale ??
    '-';

  const zones =
    log.zones ||
    log.pain_zones ||
    [];

  const notes =
    log.notes ||
    log.note ||
    '';

  const started =
    log.started ||
    log.when_did_it_start ||
    '';

  return `
    <article class="history-card history-record-card" data-history-card>
      <div class="history-record-top">
        <div class="history-child-head">
          <img
            src="${safeText(childPhoto)}"
            alt="${safeText(childName)}"
            class="history-child-photo"
          />

          <div class="history-child-meta">
            <strong>${safeText(childName)}</strong>
            <span>${date.toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        <div class="history-pain-score">
          <strong>${safeText(intensity)}</strong>
          <span>/10</span>
        </div>
      </div>

      <div class="history-detail-grid">
        <p>
          <span class="history-icon history-icon--type" aria-hidden="true"></span>
          <strong>Type</strong>
          <em>${safeText(painType)}</em>
        </p>

        <p>
          <span class="history-icon history-icon--area" aria-hidden="true"></span>
          <strong>Area</strong>
          <em>${safeText(formatZones(zones))}</em>
        </p>

        <p>
          <span class="history-icon history-icon--started" aria-hidden="true"></span>
          <strong>Started</strong>
          <em>${safeText(started || 'Not recorded')}</em>
        </p>

        <p>
          <span class="history-icon history-icon--note" aria-hidden="true"></span>
          <strong>Note</strong>
          <em>${safeText(notes || 'No note added')}</em>
        </p>
      </div>
    </article>
  `;
}

function groupHtml(title, logs) {
  if (!logs.length) return '';

  return `
    <section class="history-group">
      <h2>${title}</h2>
      <div class="history-group-list">
        ${logs.map(historyCard).join('')}
      </div>
    </section>
  `;
}

function filterLogs(logs, query) {
  const q = String(query || '').trim().toLowerCase();

  if (!q) return logs;

  return logs.filter((log) => {
    const child = getChildForLog(log);

    const haystack = [
      child?.name,
      log.childName,
      log.child_name,
      log.painType,
      log.pain_type,
      log.started,
      log.when_did_it_start,
      log.notes,
      log.note,
      formatZones(log.zones || log.pain_zones || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

function renderGroups(container, logs, filter = 'all') {
  const groups = groupLogs(logs);
  const filteredGroups = {
    today: filter === 'all' || filter === 'today' ? groups.today : [],
    week: filter === 'all' || filter === 'week' ? groups.week : [],
    earlier: filter === 'all' || filter === 'earlier' ? groups.earlier : [],
  };

  container.innerHTML = logs.length
    ? `
      ${groupHtml('Today', filteredGroups.today)}
      ${groupHtml('This Week', filteredGroups.week)}
      ${groupHtml('Earlier', filteredGroups.earlier)}
    `
    : '<p class="empty-state">No pain records found.</p>';

  if (logs.length && !container.innerHTML.trim()) {
    container.innerHTML = '<p class="empty-state">No pain records found for this filter.</p>';
  }
}

export function renderHistoryScreen(app) {
  app.innerHTML = '';

  const logs = appState.painLogs || [];
  const groups = groupLogs(logs);

  const screen = document.createElement('main');
  screen.className = 'screen history-screen mobile-fit-screen page-animate-in';

  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('History')}

    <section class="settings-content settings-content-fit history-content">
      <h1 class="children-title children-title--small">Pain History</h1>
      <p class="history-helper">See reports grouped by Today, This Week, Earlier and All.</p>
      <div class="history-group-tabs" aria-label="History groups">
        <button type="button" data-history-filter="all" class="history-group-tab is-active">All</button>
        <button type="button" data-history-filter="today" class="history-group-tab">Today</button>
        <button type="button" data-history-filter="week" class="history-group-tab">This Week</button>
        <button type="button" data-history-filter="earlier" class="history-group-tab">Earlier</button>
      </div>

      <label class="history-search-wrap" aria-label="Search pain history">
        <span class="history-search-icon" aria-hidden="true"></span>
        <input
          type="search"
          class="history-search-input"
          placeholder="Search child, pain type, area or note"
          autocomplete="off"
        />
      </label>

      <div class="history-list history-timeline" data-history-list>
        ${
          logs.length
            ? `${groupHtml('Today', groups.today)}${groupHtml('This Week', groups.week)}${groupHtml('Earlier', groups.earlier)}`
            : '<p class="empty-state">No pain records yet. Submit a pain report and it will appear here.</p>'
        }
      </div>
    </section>

    ${bottomNavHtml('history')}
  `);

  const searchInput = screen.querySelector('.history-search-input');
  const list = screen.querySelector('[data-history-list]');
  let activeFilter = 'all';

  searchInput?.addEventListener('input', () => {
    renderGroups(list, filterLogs(logs, searchInput.value), activeFilter);
  });

  screen.querySelectorAll('[data-history-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.historyFilter || 'all';
      screen.querySelectorAll('[data-history-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === button);
      });
      renderGroups(list, filterLogs(logs, searchInput?.value), activeFilter);
    });
  });

  wireBottomNav(screen);
  attachMenu(screen);

  app.append(screen);
}
