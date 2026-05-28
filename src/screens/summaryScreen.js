import { ASSETS } from '../assets';
import { appState, getActiveChild, savePainLog, updatePainDraft } from '../appState';
import { childContextHtml, formatZones } from '../sharedUi';
import { mountMiniBody } from '../miniBody3d';

export function renderSummaryScreen(app) {
  app.innerHTML = '';
  const child = getActiveChild();
  const d = appState.painDraft;
  const screen = document.createElement('main');
  screen.className = 'screen pain-scale-screen summary-screen page-animate-in';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-scale-top-bar"><button class="back-button" type="button" aria-label="Go back"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    <div class="pain-scale-body-wrap mini-body-wrap"></div>
    <div class="pain-scale-heading-wrap"><h1 class="pain-scale-title">Pain Summary</h1>${childContextHtml()}</div>
    <section class="summary-card">
      <div class="summary-child"><img src="${child?.photo_url || ASSETS.inactiveChildPhoto}" alt=""/><div><strong>${child?.name || 'Child'}</strong><span>${child?.age || '-'} years old</span></div></div>
      <div class="summary-detail-grid">
        <p>
          <span class="history-icon history-icon--area" aria-hidden="true"></span>
          <span><strong>Spots</strong><em>${formatZones(d.zones)}</em></span>
        </p>
        <p>
          <span class="history-icon history-icon--type" aria-hidden="true"></span>
          <span><strong>Feels like</strong><em>${d.painType || 'Not chosen'}</em></span>
        </p>
        <p>
          <span class="history-icon history-icon--started" aria-hidden="true"></span>
          <span><strong>Started</strong><em>${d.started || 'Not chosen'}</em></span>
        </p>
        <p>
          <span class="summary-icon summary-icon--pain" aria-hidden="true">${d.intensity ?? '-'}</span>
          <span><strong>Pain score</strong><em>${d.intensity ?? '-'} / 10</em></span>
        </p>
      </div>
      <label class="summary-note-field">
        <span><span class="history-icon history-icon--note" aria-hidden="true"></span>Add note</span>
        <textarea data-pain-note rows="3" placeholder="Add any extra detail here">${d.notes || ''}</textarea>
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
    window.location.hash = '#confirmation';
  });
  app.append(screen);
}
