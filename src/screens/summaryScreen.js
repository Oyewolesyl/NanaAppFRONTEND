import { ASSETS } from '../assets';
import { appState, getActiveChild, savePainLog, updatePainDraft } from '../appState';
import { childContextHtml, formatZones } from '../sharedUi';
import { mountMiniBody } from '../miniBody3d';

export function renderSummaryScreen(app) {
  app.innerHTML = '';
  const child = getActiveChild();
  const d = appState.painDraft;
  const screen = document.createElement('main');
  screen.className = 'screen pain-scale-screen summary-screen';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-scale-top-bar"><button class="back-button" type="button" aria-label="Go back"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    <div class="pain-scale-body-wrap mini-body-wrap"></div>
    <div class="pain-scale-heading-wrap"><h1 class="pain-scale-title">Pain Summary</h1>${childContextHtml()}</div>
    <section class="summary-card">
      <div class="summary-child"><img src="${child?.photo_url || ASSETS.inactiveChildPhoto}" alt=""/><div><strong>${child?.name || 'Child'}</strong><span>${child?.age || '-'} years old</span></div></div>
      <p><strong>Spot:</strong> ${formatZones(d.zones)}</p>
      <p><strong>Feels like:</strong> ${d.painType || 'Not chosen'}</p>
      <p><strong>Started:</strong> ${d.started || 'Not chosen'}</p>
      <p><strong>Pain:</strong> ${d.intensity ?? '-'} / 10</p>
      <label class="pain-note-field">
        <span>Add note</span>
        <textarea class="pain-note-input" placeholder="Add anything important here...">${d.notes || ''}</textarea>
      </label>
    </section>
    <div class="pain-type-actions summary-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="summary-add-spot-btn">Add Another Pain Spot</button>
      <button type="button" class="pain-type-next-btn">Submit</button>
    </div>
  `);
  mountMiniBody(screen.querySelector('.mini-body-wrap'), { view: d.view, zones: d.zones, rotate: true });
  const noteInput = screen.querySelector('.pain-note-input');
  noteInput.addEventListener('input', () => updatePainDraft({ notes: noteInput.value }));
  screen.querySelector('.back-button').addEventListener('click', () => { window.location.hash = '#pain-scale'; });
  screen.querySelector('.pain-type-back-btn').addEventListener('click', () => { window.location.hash = '#pain-scale'; });
  screen.querySelector('.summary-add-spot-btn').addEventListener('click', () => { updatePainDraft({ notes: noteInput.value }); window.location.hash = '#body-map'; });
  screen.querySelector('.pain-type-next-btn').addEventListener('click', () => { updatePainDraft({ notes: noteInput.value }); const log = savePainLog(); sessionStorage.setItem('nana_last_log_id', log.id); window.location.hash = '#confirmation'; });
  app.append(screen);
}
