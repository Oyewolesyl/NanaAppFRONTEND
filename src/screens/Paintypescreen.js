import { ASSETS } from '../assets';
import { updatePainDraft, appState } from '../appState';
import { childContextHtml } from '../sharedUi';

const TYPES = [
  { id: 'sharp', label: 'Sharp', icon: '🔺' },
  { id: 'burning', label: 'Burning', icon: '🔥' },
  { id: 'throbbing', label: 'Throbbing', icon: '💗' },
  { id: 'tingling', label: 'Tingling', icon: '✨' },
  { id: 'stabbing', label: 'Stabbing', icon: '⚡' },
  { id: 'cramping', label: 'Cramping', icon: '🌀' },
  { id: 'aching', label: 'Aching', icon: '〰️' },
  { id: 'other', label: 'Other', icon: '➕' },
];

export function renderPainTypeScreen(app, { fromScreen = '#body-map' } = {}) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen pain-type-screen';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-type-top-bar"><button class="back-button" type="button" aria-label="Go back"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    <div class="pain-type-heading-wrap"><h1 class="pain-type-title">How does it feel?</h1>${childContextHtml()}</div>
    <div class="pain-type-grid pain-type-grid--friendly" role="group" aria-label="Pain type">
      ${TYPES.map(t => `<button type="button" class="pain-card pain-card--friendly ${appState.painDraft.painType === t.id ? 'pain-card--selected' : ''}" data-type="${t.id}" aria-label="${t.label}" aria-pressed="${appState.painDraft.painType === t.id}"><span class="pain-card-icon pain-card-emoji">${t.icon}</span><span class="pain-card-label">${t.label}</span></button>`).join('')}
    </div>
    <div class="pain-type-actions"><button type="button" class="pain-type-back-btn">Back</button><button type="button" class="pain-type-next-btn" ${appState.painDraft.painType ? '' : 'disabled'}>Next</button></div>
  `);
  const nextBtn = screen.querySelector('.pain-type-next-btn');
  screen.querySelectorAll('.pain-card').forEach(card => card.addEventListener('click', () => {
    screen.querySelectorAll('.pain-card').forEach(c => { c.classList.remove('pain-card--selected'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('pain-card--selected'); card.setAttribute('aria-pressed', 'true');
    updatePainDraft({ painType: card.dataset.type });
    nextBtn.disabled = false;
  }));
  screen.querySelector('.back-button').addEventListener('click', () => { window.location.hash = fromScreen; });
  screen.querySelector('.pain-type-back-btn').addEventListener('click', () => { window.location.hash = fromScreen; });
  nextBtn.addEventListener('click', () => { window.location.hash = '#when-did-it-start'; });
  app.append(screen);
}
