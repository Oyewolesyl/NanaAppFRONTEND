import { ASSETS } from '../assets';
import { appState, getActiveChild, savePainLog, updatePainDraft } from '../appState';
import { childContextHtml, escapeHtml, formatZones, painProgressHtml } from '../sharedUi';
import { mountMiniBody } from '../miniBody3d';
import { showToast } from '../toast';

export function renderSummaryScreen(app) {
  app.innerHTML = '';
  const child = getActiveChild();
  const d = appState.painDraft;
  const childPhoto = escapeHtml(child?.photo_url || ASSETS.inactiveChildPhoto);
  const childName = escapeHtml(child?.name || 'Child');
  const childAge = escapeHtml(child?.age || '-');
  const zones = escapeHtml(formatZones(d.zones));
  const painType = escapeHtml(d.painType || 'Not chosen');
  const started = escapeHtml(d.started || 'Not chosen');
  const noteText = escapeHtml(d.notes || '');
  const screen = document.createElement('main');
  screen.className = 'screen pain-scale-screen summary-screen page-animate-in';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-scale-top-bar"><button class="back-button" type="button" aria-label="Go back"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    ${painProgressHtml(5)}
    <div class="pain-scale-body-wrap mini-body-wrap"></div>
    <div class="pain-scale-heading-wrap"><h1 class="pain-scale-title">Pain Summary</h1>${childContextHtml()}</div>
    <section class="summary-card">
      <div class="summary-child"><img src="${childPhoto}" alt=""/><div><strong>${childName}</strong><span>${childAge} years old</span></div></div>
      <div class="summary-detail-grid">
        <p>
          <span class="history-icon history-icon--area" aria-hidden="true"></span>
          <span><strong>Spots</strong><em>${zones}</em></span>
        </p>
        <p>
          <span class="history-icon history-icon--type" aria-hidden="true"></span>
          <span><strong>Feels like</strong><em>${painType}</em></span>
        </p>
        <p>
          <span class="history-icon history-icon--started" aria-hidden="true"></span>
          <span><strong>Started</strong><em>${started}</em></span>
        </p>
        <p>
          <span class="summary-icon summary-icon--pain" aria-hidden="true">${d.intensity ?? '-'}</span>
          <span><strong>Pain score</strong><em>${d.intensity ?? '-'} / 10</em></span>
        </p>
      </div>
      <label class="summary-note-field">
        <span><span class="history-icon history-icon--note" aria-hidden="true"></span>Add note</span>
        <textarea data-pain-note rows="3" placeholder="Add any extra detail here">${noteText}</textarea>
      </label>
    </section>
    <div class="pain-type-actions"><button type="button" class="pain-type-back-btn">Back</button><button type="button" class="pain-type-next-btn">Submit</button></div>
  `);
  mountMiniBody(screen.querySelector('.mini-body-wrap'), { view: d.view, zones: d.zones, rotate: true });
  const note = screen.querySelector('[data-pain-note]');
  note.addEventListener('input', () => updatePainDraft({ notes: note.value }));
  screen.querySelector('.back-button').addEventListener('click', () => { window.location.hash = '#pain-scale'; });
  screen.querySelector('.pain-type-back-btn').addEventListener('click', () => { window.location.hash = '#pain-scale'; });
  screen.querySelector('.pain-type-next-btn').addEventListener('click', () => {
    updatePainDraft({ notes: note.value });
    const log = savePainLog();
    sessionStorage.setItem('nana_last_log_id', log.id);
    showToast('Pain report saved');
    window.location.hash = '#confirmation';
  });
  app.append(screen);
}
