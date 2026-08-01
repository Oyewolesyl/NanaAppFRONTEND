import { ASSETS } from '../assets';
import { updatePainDraft, appState } from '../appState';
import { childContextHtml, painProgressHtml } from '../sharedUi';

const TYPES = [
  { id: 'sharp', label: 'Sharp', hint: 'Sudden and pointed' },
  { id: 'burning', label: 'Burning', hint: 'Hot or stinging' },
  { id: 'throbbing', label: 'Throbbing', hint: 'Pulsing pain' },
  { id: 'tingling', label: 'Tingling', hint: 'Pins and needles' },
  { id: 'stabbing', label: 'Stabbing', hint: 'Deep quick pain' },
  { id: 'cramping', label: 'Cramping', hint: 'Tight or squeezing' },
  { id: 'aching', label: 'Aching', hint: 'Dull and steady' },
  { id: 'other', label: 'Other', hint: 'Something else' },
];

function painTypeVisual(type) {
  const visuals = {
    sharp: `
      <svg viewBox="0 0 96 96" role="img" aria-label="sharp pain">
        <path class="pain-visual-glow" d="M18 74 72 20" />
        <path class="pain-visual-red" d="M24 68 66 26" />
        <circle class="pain-visual-dot" cx="69" cy="23" r="7" />
      </svg>`,
    burning: `
      <svg viewBox="0 0 96 96" role="img" aria-label="burning pain">
        <path class="pain-visual-flame pain-visual-flame--outer" d="M50 12c7 14 24 23 24 45 0 17-12 29-27 29S20 75 20 58c0-16 10-26 19-35-1 12 5 19 11 24 5-10 1-21 0-35Z" />
        <path class="pain-visual-flame pain-visual-flame--inner" d="M49 46c5 8 12 12 12 22 0 9-6 15-14 15s-14-6-14-15c0-8 5-14 10-20 0 6 3 10 7 13 2-5 0-10-1-15Z" />
      </svg>`,
    throbbing: `
      <svg viewBox="0 0 96 96" role="img" aria-label="throbbing pain">
        <circle class="pain-visual-ring pain-visual-ring--wide" cx="48" cy="48" r="28" />
        <circle class="pain-visual-ring" cx="48" cy="48" r="18" />
        <circle class="pain-visual-dot" cx="48" cy="48" r="8" />
      </svg>`,
    tingling: `
      <svg viewBox="0 0 96 96" role="img" aria-label="tingling pain">
        <circle class="pain-visual-dot pain-visual-dot--teal" cx="28" cy="30" r="7" />
        <circle class="pain-visual-dot" cx="52" cy="24" r="6" />
        <circle class="pain-visual-dot pain-visual-dot--blue" cx="66" cy="48" r="7" />
        <circle class="pain-visual-dot pain-visual-dot--yellow" cx="38" cy="62" r="6" />
        <path class="pain-visual-spark" d="M25 50h16M33 42v16M60 68h13M66.5 61.5v13" />
      </svg>`,
    stabbing: `
      <svg viewBox="0 0 96 96" role="img" aria-label="stabbing pain">
        <path class="pain-visual-red" d="M32 76 58 21l13 13-55 26 16 16Z" />
        <path class="pain-visual-dark" d="M58 21 73 8l15 15-17 11-13-13Z" />
      </svg>`,
    cramping: `
      <svg viewBox="0 0 96 96" role="img" aria-label="cramping pain">
        <path class="pain-visual-curve" d="M22 38c12-18 32-18 44 0 11 17 2 36-17 36-16 0-23-13-16-25 6-10 20-9 25 1" />
        <path class="pain-visual-squeeze" d="M17 55h17M62 55h17" />
      </svg>`,
    aching: `
      <svg viewBox="0 0 96 96" role="img" aria-label="aching pain">
        <path class="pain-visual-wave" d="M18 55c10-14 20-14 30 0s20 14 30 0" />
        <path class="pain-visual-wave pain-visual-wave--soft" d="M18 69c10-10 20-10 30 0s20 10 30 0" />
      </svg>`,
    other: `
      <svg viewBox="0 0 96 96" role="img" aria-label="other pain">
        <circle class="pain-visual-dot" cx="30" cy="34" r="7" />
        <circle class="pain-visual-dot pain-visual-dot--teal" cx="48" cy="58" r="7" />
        <circle class="pain-visual-dot pain-visual-dot--blue" cx="66" cy="35" r="7" />
        <path class="pain-visual-question" d="M42 31c3-7 17-8 20 1 4 11-10 12-10 23" />
        <circle class="pain-visual-question-dot" cx="52" cy="70" r="4" />
      </svg>`,
  };

  return visuals[type.id] || visuals.other;
}

export function renderPainTypeScreen(app, { fromScreen = '#body-map' } = {}) {
  app.innerHTML = '';
  const screen = document.createElement('main');
  screen.className = 'screen pain-type-screen page-animate-in';

  screen.insertAdjacentHTML('beforeend', `
    <header class="top-bar pain-type-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>
    ${painProgressHtml(2)}
    <div class="pain-type-heading-wrap">
      <h1 class="pain-type-title">How does it feel?</h1>
      ${childContextHtml()}
    </div>
    <div class="pain-type-grid pain-type-grid--friendly" role="group" aria-label="Pain type">
      ${TYPES.map((type) => `
        <button
          type="button"
          class="pain-card pain-card--friendly ${appState.painDraft.painType === type.id ? 'pain-card--selected' : ''}"
          data-type="${type.id}"
          aria-label="${type.label}"
          aria-pressed="${appState.painDraft.painType === type.id}"
        >
          <span class="pain-card-icon pain-card-icon--${type.id}" aria-hidden="true">${painTypeVisual(type)}</span>
          <span class="pain-card-label">${type.label}</span>
          <span class="pain-card-hint">${type.hint}</span>
        </button>
      `).join('')}
    </div>
    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn" ${appState.painDraft.painType ? '' : 'disabled'}>Next</button>
    </div>
  `);

  const nextBtn = screen.querySelector('.pain-type-next-btn');

  screen.querySelectorAll('.pain-card').forEach((card) => {
    card.addEventListener('click', () => {
      screen.querySelectorAll('.pain-card').forEach((item) => {
        item.classList.remove('pain-card--selected');
        item.setAttribute('aria-pressed', 'false');
      });

      card.classList.add('pain-card--selected');
      card.setAttribute('aria-pressed', 'true');
      updatePainDraft({ painType: card.dataset.type });
      nextBtn.disabled = false;
    });
  });

  screen.querySelector('.back-button').addEventListener('click', () => {
    window.location.hash = fromScreen;
  });

  screen.querySelector('.pain-type-back-btn').addEventListener('click', () => {
    window.location.hash = fromScreen;
  });

  nextBtn.addEventListener('click', () => {
    window.location.hash = '#when-did-it-start';
  });

  app.append(screen);
}
