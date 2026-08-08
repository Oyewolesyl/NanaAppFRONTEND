const TOUR_STORAGE_KEY = 'nana_guided_tour_complete';
const TOUR_ACTIVE_KEY = 'nana_guided_tour_active';

const TOUR_STEPS = [
  {
    route: '#select-role',
    target: '.role-options',
    title: 'choose your role',
    body: 'start as a caregiver or professional so nana can shape the next screens around the user.',
    action: 'got it',
  },
  {
    route: '#auth',
    target: '.auth-mode-switch',
    title: 'create or enter safely',
    body: 'sign up for a saved account, log in, or use testing mode while validating the prototype.',
    action: 'continue',
  },
  {
    route: '#homepage-newuser',
    target: '[data-add-child], .children-add-button, .floating-add-btn',
    title: 'add the child first',
    body: 'each pain report needs a child profile so the handoff stays connected to the right person.',
    action: 'next',
  },
  {
    route: '#child-added',
    target: '.child-open-map-btn, .open-body-map-button',
    title: 'open the body map',
    body: 'this is the main reporting action. it takes the caregiver from a child profile into the visual pain flow.',
    action: 'next',
  },
  {
    route: '#body-map',
    target: '.body-map-wrap',
    title: 'tap where it hurts',
    body: 'rotate and zoom the body, then tap the exact area before moving to the next report step.',
    action: 'next',
  },
  {
    route: '#pain-type',
    target: '.pain-type-grid',
    title: 'describe the feeling',
    body: 'the app translates child-friendly choices into a structured pain report.',
    action: 'next',
  },
  {
    route: '#pain-scale',
    target: '.pain-scale-choice-row',
    title: 'rate the pain clearly',
    body: 'the scale turns the child response into a readable severity score for the final summary.',
    action: 'next',
  },
  {
    route: '#assistant',
    target: '.assistant-chat-shell, .assistant-screen, .assistant-hero, .assistant-empty, [data-assistant-panel]',
    title: 'review nana assistant',
    body: 'the assistant creates a caregiver-ready handoff, highlights attention level, and keeps the safety disclaimer visible.',
    action: 'finish',
  },
];

let overlay;

function getRoute() {
  return window.location.hash || '#get-started';
}

function getStepIndex(route = getRoute()) {
  return TOUR_STEPS.findIndex((step) => step.route === route);
}

function isTourActive() {
  return sessionStorage.getItem(TOUR_ACTIVE_KEY) === 'true';
}

function ensureOverlay() {
  if (overlay?.isConnected) return overlay;

  overlay = document.createElement('aside');
  overlay.className = 'nana-tour';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-live', 'polite');
  overlay.innerHTML = `
    <button type="button" class="nana-tour-skip" data-tour-skip>skip</button>
    <div class="nana-tour-spotlight" aria-hidden="true"></div>
    <section class="nana-tour-card">
      <span class="nana-tour-count"></span>
      <h2></h2>
      <p></p>
      <button type="button" data-tour-next></button>
    </section>
  `;

  overlay.querySelector('[data-tour-skip]').addEventListener('click', finishTour);
  overlay.querySelector('[data-tour-next]').addEventListener('click', advanceTour);
  document.body.append(overlay);
  return overlay;
}

function finishTour() {
  sessionStorage.removeItem(TOUR_ACTIVE_KEY);
  localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  if (overlay) overlay.hidden = true;
}

function advanceTour() {
  const currentIndex = Number(overlay?.dataset.index || getStepIndex());
  const next = TOUR_STEPS[currentIndex + 1];

  if (!next) {
    finishTour();
    return;
  }

  sessionStorage.setItem(TOUR_ACTIVE_KEY, 'true');
  window.location.hash = next.route;
}

function positionTourCard(step, target) {
  const tour = ensureOverlay();
  const spotlight = tour.querySelector('.nana-tour-spotlight');
  const card = tour.querySelector('.nana-tour-card');
  const rect = target.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gap = 12;
  const reservedBottom = 118;
  const cardHeight = 196;
  const spotlightPad = 8;

  const spotlightX = Math.max(10, rect.left - spotlightPad);
  const spotlightY = Math.max(10, rect.top - spotlightPad);
  const spotlightWidth = Math.min(viewportWidth - 20, rect.width + spotlightPad * 2);
  const spotlightHeight = Math.min(
    viewportHeight - reservedBottom - spotlightY,
    rect.height + spotlightPad * 2
  );

  spotlight.style.setProperty('--tour-x', `${spotlightX}px`);
  spotlight.style.setProperty('--tour-y', `${spotlightY}px`);
  spotlight.style.setProperty('--tour-w', `${spotlightWidth}px`);
  spotlight.style.setProperty('--tour-h', `${Math.max(70, spotlightHeight)}px`);

  const cardWidth = Math.min(318, viewportWidth - 28);
  const belowTop = rect.bottom + gap;
  const aboveTop = rect.top - cardHeight - gap;
  const maxTop = Math.max(14, viewportHeight - reservedBottom - cardHeight);
  const top = belowTop + cardHeight < viewportHeight - reservedBottom
    ? belowTop
    : Math.max(14, Math.min(aboveTop, maxTop));
  const left = Math.min(
    viewportWidth - cardWidth - 14,
    Math.max(14, rect.left + rect.width / 2 - cardWidth / 2)
  );

  card.style.width = `${cardWidth}px`;
  card.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
  card.dataset.placement = top < rect.top ? 'above' : 'below';
}

export function startGuidedTour({ force = false } = {}) {
  if (!force && localStorage.getItem(TOUR_STORAGE_KEY) === 'true') return;
  sessionStorage.setItem(TOUR_ACTIVE_KEY, 'true');
  setTimeout(showGuidedTourForRoute, 180);
}

export function showGuidedTourForRoute() {
  if (!isTourActive()) return;

  const route = getRoute();
  const index = getStepIndex(route);
  const step = TOUR_STEPS[index];

  if (!step) {
    ensureOverlay().hidden = true;
    return;
  }

  const target = document.querySelector(step.target);
  if (!target) {
    if (index === TOUR_STEPS.length - 1) {
      finishTour();
      return;
    }

    setTimeout(showGuidedTourForRoute, 250);
    return;
  }

  const tour = ensureOverlay();
  tour.dataset.index = String(index);
  tour.querySelector('.nana-tour-count').textContent = `${index + 1} of ${TOUR_STEPS.length}`;
  tour.querySelector('h2').textContent = step.title;
  tour.querySelector('p').textContent = step.body;
  tour.querySelector('[data-tour-next]').textContent = step.action;
  positionTourCard(step, target);
  tour.hidden = false;
}

window.addEventListener('resize', () => {
  if (!overlay || overlay.hidden) return;
  showGuidedTourForRoute();
});
