import { ASSETS } from '../assets';
import { appState, getActiveChild, loadPainDraftFromLog } from '../appState';
import { mountMiniBody } from '../miniBody3d';
import { escapeHtml, formatZones } from '../sharedUi';
import { careInsightHtml, wireCareInsightActions } from '../aiCareAssistant';
import { showToast } from '../toast';

export function renderConfirmationScreen(app) {
  app.innerHTML = '';
  const logId = sessionStorage.getItem('nana_last_log_id');
  const log = appState.painLogs.find(x => x.id === logId) || appState.painLogs[0];
  const child = getActiveChild();
  const savedName = escapeHtml(log?.childName || child?.name || 'this child');
  const savedPhoto = escapeHtml(log?.childPhoto || log?.photo_url || child?.photo_url || ASSETS.inactiveChildPhoto);
  const savedTime = escapeHtml(log ? new Date(log.created_at).toLocaleString() : new Date().toLocaleString());
  const savedZones = escapeHtml(formatZones(log?.zones || []));
  const savedNotes = escapeHtml(log?.notes || '');
  const screen = document.createElement('main');
  screen.className = 'screen pain-scale-screen confirmation-screen page-animate-in';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-scale-top-bar"><button class="back-button" type="button" aria-label="Home"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    <div class="pain-scale-body-wrap mini-body-wrap"></div>
    <div class="pain-scale-heading-wrap confirmation-heading-wrap">
      <h1 class="pain-scale-title">Pain recorded</h1>
      <div class="confirmation-child-pill">
        <img src="${savedPhoto}" alt="" />
        <span>Saved for <strong>${savedName}</strong></span>
      </div>
    </div>
    <section class="summary-card confirmation-summary-card">
      <div class="summary-detail-grid">
        <p>
          <span class="history-icon history-icon--started" aria-hidden="true"></span>
          <span><strong>Time</strong><em>${savedTime}</em></span>
        </p>
        <p>
          <span class="summary-icon summary-icon--pain" aria-hidden="true">${log?.intensity ?? '-'}</span>
          <span><strong>Pain score</strong><em>${log?.intensity ?? '-'} / 10</em></span>
        </p>
        <p>
          <span class="history-icon history-icon--area" aria-hidden="true"></span>
          <span><strong>Spots</strong><em>${savedZones}</em></span>
        </p>
        ${log?.notes ? `<p>
          <span class="history-icon history-icon--note" aria-hidden="true"></span>
          <span><strong>Note</strong><em>${savedNotes}</em></span>
        </p>` : ''}
      </div>
    </section>
    ${log ? careInsightHtml(log) : ''}
    <div class="confirmation-actions"><button type="button" class="continue-button" data-add-spot>Add Another Pain Spot</button><button type="button" class="pain-type-back-btn" data-history>History</button><button type="button" class="pain-type-next-btn" data-finish>Finish</button></div>
  `);
  mountMiniBody(screen.querySelector('.mini-body-wrap'), { view: log?.view || 'rotatable', zones: log?.zones || [], rotate: true });
  screen.querySelector('.back-button').addEventListener('click', () => { window.location.hash = '#child-added'; });
  screen.querySelector('[data-add-spot]').addEventListener('click', () => {
    if (log?.id) {
      sessionStorage.setItem('nana_extend_log_id', log.id);
      loadPainDraftFromLog(log);
    }
    window.location.hash = '#body-map';
  });
  screen.querySelector('[data-history]').addEventListener('click', () => { window.location.hash = '#history'; });
  screen.querySelector('[data-finish]').addEventListener('click', () => { window.location.hash = '#child-added'; });
  wireCareInsightActions(screen, {
    onCopied: () => showToast('Handoff copied'),
  });
  app.append(screen);
}
