import { ASSETS } from '../assets';
import { appState, getActiveChild, resetPainDraft } from '../appState';
import { mountMiniBody } from '../miniBody3d';

export function renderConfirmationScreen(app) {
  app.innerHTML = '';
  const logId = sessionStorage.getItem('nana_last_log_id');
  const log = appState.painLogs.find(x => x.id === logId) || appState.painLogs[0];
  const child = getActiveChild();
  const screen = document.createElement('main');
  screen.className = 'screen pain-scale-screen confirmation-screen';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-scale-top-bar"><button class="back-button" type="button" aria-label="Home"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    <div class="pain-scale-body-wrap mini-body-wrap"></div>
    <div class="pain-scale-heading-wrap"><h1 class="pain-scale-title">Pain recorded</h1><p class="pain-scale-subtitle">Saved for ${log?.childName || child?.name || 'this child'}.</p></div>
    <section class="summary-card"><p><strong>Time:</strong> ${log ? new Date(log.created_at).toLocaleString() : new Date().toLocaleString()}</p><p><strong>Pain:</strong> ${log?.intensity ?? '-'} / 10</p></section>
    <div class="confirmation-actions"><button type="button" class="continue-button" data-add-spot>Add Another Pain Spot</button><button type="button" class="pain-type-back-btn" data-history>History</button><button type="button" class="pain-type-next-btn" data-finish>Finish</button></div>
  `);
  mountMiniBody(screen.querySelector('.mini-body-wrap'), { view: log?.view || 'front', zones: log?.zones || [], rotate: true });
  screen.querySelector('.back-button').addEventListener('click', () => { window.location.hash = '#child-added'; });
  screen.querySelector('[data-add-spot]').addEventListener('click', () => { resetPainDraft(); window.location.hash = '#body-map'; });
  screen.querySelector('[data-history]').addEventListener('click', () => { window.location.hash = '#history'; });
  screen.querySelector('[data-finish]').addEventListener('click', () => { window.location.hash = '#child-added'; });
  app.append(screen);
}
