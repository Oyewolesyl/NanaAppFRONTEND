import { appState } from '../appState';
import {
  headerHtml,
  bottomNavHtml,
  wireBottomNav,
  attachMenu,
  formatZones,
} from '../sharedUi';
import {
  createAssistantAssessment,
  safeText,
  wireCareInsightActions,
} from '../aiCareAssistant';
import { showToast } from '../toast';

function getLatestLog() {
  return [...(appState.painLogs || [])]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
}

function getChildName(log) {
  return log?.childName || log?.child_name || 'this child';
}

function questionHtml(question, answers) {
  const current = answers[question.key] || '';

  return `
    <fieldset class="assistant-question" data-question="${question.key}">
      <legend>${safeText(question.label)}</legend>
      <div>
        <button type="button" data-answer="yes" class="${current === 'yes' ? 'is-selected' : ''}">Yes</button>
        <button type="button" data-answer="no" class="${current === 'no' ? 'is-selected' : ''}">No</button>
      </div>
    </fieldset>
  `;
}

function renderAssessment(screen, log, answers) {
  const assessment = createAssistantAssessment({
    log,
    logs: appState.painLogs,
    answers,
  });

  const panel = screen.querySelector('[data-assistant-panel]');
  panel.innerHTML = `
    <section class="assistant-hero assistant-hero--${assessment.tone}">
      <span>Nana Assistant</span>
      <h1>${safeText(assessment.level)}</h1>
      <p>${safeText(assessment.summary)}</p>
    </section>

    <section class="assistant-report-card">
      <div>
        <strong>${safeText(getChildName(log))}</strong>
        <span>${new Date(log.created_at || Date.now()).toLocaleString()}</span>
      </div>
      <p><b>Area</b>${safeText(formatZones(log.zones || log.pain_zones || []))}</p>
      <p><b>Type</b>${safeText(log.painType || log.pain_type || 'Not recorded')}</p>
      <p><b>Score</b>${safeText(log.intensity ?? log.pain_scale ?? '-')} / 10</p>
      <p><b>Trend</b>${safeText(assessment.trend)}</p>
    </section>

    <section class="assistant-section assistant-intelligence-panel">
      <div class="assistant-intelligence-top">
        <span>handoff readiness</span>
        <strong>${safeText(assessment.signals.confidenceScore)}%</strong>
      </div>
      <p>Nana checks the report, recent history, and follow-up answers to prepare a clear care handoff.</p>
      <div class="assistant-signal-grid">
        ${assessment.signals.signals.map((signal) => `<span>${safeText(signal)}</span>`).join('')}
      </div>
      ${
        assessment.signals.missingFields.length
          ? `<small>add more detail for: ${safeText(assessment.signals.missingFields.join(', '))}</small>`
          : '<small>the handoff has enough structure for a caregiver or professional conversation.</small>'
      }
    </section>

    <section class="assistant-section">
      <h2>Follow-up check</h2>
      <div class="assistant-question-list">
        ${assessment.questions.map((question) => questionHtml(question, answers)).join('')}
      </div>
    </section>

    <section class="assistant-section">
      <h2>Care plan</h2>
      <div class="assistant-care-plan">
        ${assessment.carePlan.map((step, index) => `<p><span>${index + 1}</span>${safeText(step)}</p>`).join('')}
      </div>
    </section>

    <section class="ai-care-card ai-care-card--${assessment.tone} assistant-handoff-card">
      <div class="ai-care-card__top">
        <span class="ai-care-badge">Nana AI</span>
        <strong>Shareable handoff</strong>
      </div>
      <label class="ai-care-handoff">
        <span>Doctor-ready handoff</span>
        <textarea readonly rows="5">${safeText(assessment.handoff)}</textarea>
      </label>
      <div class="ai-care-actions">
        <button type="button" data-copy-handoff>Copy handoff</button>
        <button type="button" data-start-report>New report</button>
      </div>
      <small>This assistant supports care decisions. It does not diagnose or replace medical help.</small>
    </section>
  `;

  panel.querySelectorAll('.assistant-question').forEach((field) => {
    field.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => {
        answers[field.dataset.question] = button.dataset.answer;
        renderAssessment(screen, log, answers);
      });
    });
  });

  panel.querySelector('[data-start-report]')?.addEventListener('click', () => {
    window.location.hash = '#body-map';
  });

  wireCareInsightActions(panel, {
    onCopied: () => showToast('Handoff copied'),
  });
}

export function renderAssistantScreen(app) {
  app.innerHTML = '';

  const log = getLatestLog();
  const screen = document.createElement('main');
  screen.className = 'screen assistant-screen mobile-fit-screen page-animate-in';

  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('Assistant')}

    <section class="assistant-content settings-content settings-content-fit">
      ${
        log
          ? '<div data-assistant-panel></div>'
          : `<section class="assistant-empty">
              <span>Nana Assistant</span>
              <h1>No pain report yet</h1>
              <p>Start by recording where it hurts, how it feels, when it began, and the pain score. Nana Assistant will turn that into a care plan.</p>
              <button type="button" class="continue-button" data-start-report>Start report</button>
            </section>`
      }
    </section>

    ${bottomNavHtml('assistant')}
  `);

  if (log) {
    renderAssessment(screen, log, {});
  }

  screen.querySelector('[data-start-report]')?.addEventListener('click', () => {
    window.location.hash = '#body-map';
  });

  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
