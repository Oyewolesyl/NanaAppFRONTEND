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
          <span class="pain-card-icon pain-card-icon--${type.id}" aria-hidden="true"></span>
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
