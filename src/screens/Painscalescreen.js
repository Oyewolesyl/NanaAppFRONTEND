import { ASSETS } from '../assets';
import { appState, updatePainDraft } from '../appState';
import { childContextHtml } from '../sharedUi';
import { mountMiniBody } from '../miniBody3d';

const LEVELS = [
  { value: 0, face: '🙂', label: 'None' },
  { value: 2, face: '😐', label: 'Small' },
  { value: 4, face: '🙁', label: 'Medium' },
  { value: 6, face: '😣', label: 'Big' },
  { value: 8, face: '😭', label: 'Very big' },
  { value: 10, face: '🚨', label: 'Worst' },
];

export function renderPainScaleScreen(app, { fromScreen = '#when-did-it-start' } = {}) {
  app.innerHTML = '';
  const current = appState.painDraft.intensity;
  const screen = document.createElement('main');
  screen.className = 'screen pain-scale-screen';
  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-scale-top-bar"><button class="back-button" type="button" aria-label="Go back"><img src="${ASSETS.backChevron}" alt=""/></button></header>
    <div class="pain-scale-body-wrap mini-body-wrap" aria-label="Selected body spot"></div>
    <div class="pain-scale-heading-wrap"><h1 class="pain-scale-title">How much pain?</h1>${childContextHtml()}<p class="pain-scale-subtitle">Tap the face that feels closest.</p></div>
    <div class="pain-scale-choice-row" role="group" aria-label="Pain intensity">
      ${LEVELS.map(l => `<button type="button" class="pain-face-choice ${current === l.value ? 'pain-face-choice--selected' : ''}" data-level="${l.value}" aria-label="${l.label}"><span>${l.face}</span><small>${l.value}</small></button>`).join('')}
    </div>
    <div class="pain-scale-simple-meter"><span style="width:${Math.max(0, current || 0) * 10}%"></span></div>
    <div class="pain-type-actions"><button type="button" class="pain-type-back-btn">Back</button><button type="button" class="pain-type-next-btn" ${current === null || current === undefined ? 'disabled' : ''}>Next</button></div>
  `);
  mountMiniBody(screen.querySelector('.mini-body-wrap'), { view: appState.painDraft.view, zones: appState.painDraft.zones, rotate: true });
  const next = screen.querySelector('.pain-type-next-btn');
  const meter = screen.querySelector('.pain-scale-simple-meter span');
  screen.querySelectorAll('.pain-face-choice').forEach(btn => btn.addEventListener('click', () => {
    screen.querySelectorAll('.pain-face-choice').forEach(x => x.classList.remove('pain-face-choice--selected'));
    btn.classList.add('pain-face-choice--selected');
    const value = Number(btn.dataset.level);
    updatePainDraft({ intensity: value });
    meter.style.width = `${value * 10}%`;
    next.disabled = false;
  }));
  screen.querySelector('.back-button').addEventListener('click', () => { window.location.hash = fromScreen; });
  screen.querySelector('.pain-type-back-btn').addEventListener('click', () => { window.location.hash = fromScreen; });
  next.addEventListener('click', () => { window.location.hash = '#summary'; });
  app.append(screen);
}
