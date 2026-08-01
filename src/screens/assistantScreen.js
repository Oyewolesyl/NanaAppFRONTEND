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
import { askNanaAssistant } from '../assistantProvider';
import { showToast } from '../toast';

const SELECTED_ASSISTANT_LOG_KEY = 'nana_assistant_log_id';

function getSortedLogs() {
  return [...(appState.painLogs || [])]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

function getAssistantLog() {
  const logs = getSortedLogs();
  const selectedId = sessionStorage.getItem(SELECTED_ASSISTANT_LOG_KEY);
  return logs.find((log) => log.id === selectedId) || logs[0] || null;
}

function getChildName(log) {
  return log?.childName || log?.child_name || 'this child';
}

function getIntensity(log = {}) {
  return Number(log.intensity ?? log.pain_scale ?? 0) || 0;
}

function getPainType(log = {}) {
  return log.painType || log.pain_type || 'pain';
}

function getStarted(log = {}) {
  return log.started || log.when_did_it_start || 'not recorded';
}

function reportBubbleHtml(log, assessment) {
  return `
    <article class="assistant-report-bubble">
      <div>
        <span>report loaded</span>
        <strong>${safeText(getChildName(log))}</strong>
      </div>
      <p><b>${safeText(getIntensity(log))}/10</b> ${safeText(getPainType(log))} pain</p>
      <p>${safeText(formatZones(log.zones || log.pain_zones || []))}</p>
      <small>${safeText(assessment.trend)}</small>
    </article>
  `;
}

function assistantReplyFor(mode, log, assessment) {
  const child = getChildName(log);
  const intensity = getIntensity(log);
  const zoneText = formatZones(log.zones || log.pain_zones || []);
  const started = getStarted(log);

  if (mode === 'watch') {
    return [
      `${child} has a ${intensity}/10 report, so keep the child comfortable and watch for changes in energy, movement, breathing, fever, vomiting, dizziness, or pain spreading.`,
      intensity >= 5
        ? 'save another report in 30-60 minutes so the trend is visible.'
        : 'save another report later today if the pain changes.',
    ].join(' ');
  }

  if (mode === 'handoff') {
    return assessment.handoff;
  }

  if (mode === 'compare') {
    return assessment.trend;
  }

  return `${child} reported ${getPainType(log)} pain around ${zoneText.toLowerCase()} with a score of ${intensity}/10. it started: ${started}. ${assessment.summary}`;
}

function answerFreeText(question, log, assessment) {
  const q = String(question || '').toLowerCase();

  // This local rules engine keeps the resit feature explainable: it reads the
  // saved report, detects intent from the user's message, and returns grounded
  // care-support copy without pretending to diagnose.
  if (q.includes('handoff') || q.includes('doctor') || q.includes('share')) {
    return assistantReplyFor('handoff', log, assessment);
  }

  if (q.includes('watch') || q.includes('warning') || q.includes('worry') || q.includes('red flag')) {
    return assistantReplyFor('watch', log, assessment);
  }

  if (q.includes('trend') || q.includes('history') || q.includes('compare')) {
    return assistantReplyFor('compare', log, assessment);
  }

  if (q.includes('next') || q.includes('do')) {
    return assessment.carePlan.join(' ');
  }

  return assistantReplyFor('explain', log, assessment);
}

function messageHtml(role, text) {
  return `
    <div class="assistant-chat-message assistant-chat-message--${role}">
      <p>${safeText(text)}</p>
    </div>
  `;
}

function typingHtml() {
  return `
    <div class="assistant-chat-message assistant-chat-message--assistant assistant-chat-message--typing" data-typing-message>
      <p><span></span><span></span><span></span></p>
    </div>
  `;
}

function renderAssistantChat(screen, log) {
  const assessment = createAssistantAssessment({
    log,
    logs: getSortedLogs(),
    answers: {},
  });
  const panel = screen.querySelector('[data-assistant-panel]');

  panel.innerHTML = `
    <section class="assistant-chat-shell ai-care-card assistant-chat-shell--${assessment.tone}">
      <div class="assistant-chat-head">
        <span>nana assistant</span>
        <strong>${safeText(assessment.level)}</strong>
        <p>${safeText(assessment.summary)}</p>
      </div>

      <div class="assistant-chat-thread" data-chat-thread>
        ${messageHtml('assistant', `i have opened ${getChildName(log)}'s latest pain report. ask me what to watch, what to do next, or ask for a handoff note.`)}
        <div class="assistant-chat-message assistant-chat-message--user">
          ${reportBubbleHtml(log, assessment)}
        </div>
        ${messageHtml('assistant', assistantReplyFor('explain', log, assessment))}
      </div>

      <div class="assistant-quick-actions" aria-label="assistant suggestions">
        <button type="button" data-assistant-prompt="explain">explain report</button>
        <button type="button" data-assistant-prompt="watch">what to watch</button>
        <button type="button" data-assistant-prompt="handoff">prepare handoff</button>
        <button type="button" data-assistant-prompt="compare">compare history</button>
      </div>

      <form class="assistant-chat-form" data-assistant-form>
        <input type="text" data-assistant-input placeholder="ask nana about this report" autocomplete="off" />
        <button type="submit">send</button>
      </form>

      <div class="assistant-chat-footer">
        <label class="ai-care-handoff assistant-hidden-handoff">
          <span>doctor-ready handoff</span>
          <textarea readonly rows="4">${safeText(assessment.handoff)}</textarea>
        </label>
        <button type="button" data-copy-handoff>copy handoff</button>
        <button type="button" data-start-report>new report</button>
      </div>

      <small class="assistant-safety-note">nana supports care decisions. it does not diagnose or replace medical help.</small>
    </section>
  `;

  const thread = panel.querySelector('[data-chat-thread]');

  async function appendExchange(userText, replyTextOrPromise) {
    thread.insertAdjacentHTML('beforeend', messageHtml('user', userText));
    thread.insertAdjacentHTML('beforeend', typingHtml());
    thread.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    const startedAt = window.performance.now();
    const replyText = await Promise.resolve(replyTextOrPromise);
    const elapsed = window.performance.now() - startedAt;
    const remainingDelay = Math.max(340 - elapsed, 0);

    window.setTimeout(() => {
      thread.querySelector('[data-typing-message]')?.remove();
      thread.insertAdjacentHTML('beforeend', messageHtml('assistant', replyText));
      thread.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, remainingDelay);
  }

  panel.querySelectorAll('[data-assistant-prompt]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.assistantPrompt || 'explain';
      appendExchange(button.textContent, assistantReplyFor(mode, log, assessment));
    });
  });

  panel.querySelector('[data-assistant-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = panel.querySelector('[data-assistant-input]');
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    appendExchange(
      question,
      askNanaAssistant({
        question,
        log,
        assessment,
        fallbackAnswer: (fallbackQuestion) => answerFreeText(fallbackQuestion, log, assessment),
      })
    );
  });

  panel.querySelector('[data-start-report]')?.addEventListener('click', () => {
    window.location.hash = '#body-map';
  });

  wireCareInsightActions(panel, {
    onCopied: () => showToast('handoff copied'),
  });
}

export function renderAssistantScreen(app) {
  app.innerHTML = '';

  const log = getAssistantLog();
  const screen = document.createElement('main');
  screen.className = 'screen assistant-screen mobile-fit-screen page-animate-in';

  screen.insertAdjacentHTML('beforeend', `
    ${headerHtml('Assistant')}

    <section class="assistant-content settings-content settings-content-fit">
      ${
        log
          ? '<div data-assistant-panel></div>'
          : `<section class="assistant-empty assistant-chat-shell">
              <div class="assistant-chat-head">
                <span>nana assistant</span>
                <strong>no report yet</strong>
                <p>start a pain report so nana can turn the details into a clear care handoff.</p>
              </div>
              <button type="button" class="continue-button" data-start-report>start report</button>
            </section>`
      }
    </section>

    ${bottomNavHtml('assistant')}
  `);

  if (log) {
    renderAssistantChat(screen, log);
  }

  screen.querySelector('[data-start-report]')?.addEventListener('click', () => {
    window.location.hash = '#body-map';
  });

  wireBottomNav(screen);
  attachMenu(screen);
  app.append(screen);
}
