import { formatZones } from './sharedUi';

const HIGH_INTENSITY = 8;
const MODERATE_INTENSITY = 5;
const WATCH_WORDS = ['fever', 'vomit', 'vomiting', 'bleeding', 'dizzy', 'faint', 'swelling', 'breathing'];
const RED_FLAG_KEYS = ['fever', 'injury', 'breathing', 'gettingWorse'];

// All assistant copy is rendered into template strings, so every dynamic value
// must pass through safeText before it reaches the DOM.
export function safeText(value, fallback = '') {
  return String(value ?? fallback)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function textIncludesWatchWord(log = {}) {
  const note = String(log.notes || log.note || '').toLowerCase();
  return WATCH_WORDS.some((word) => note.includes(word));
}

function getIntensity(log = {}) {
  const value = Number(log.intensity ?? log.pain_scale ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function getPainType(log = {}) {
  return log.painType || log.pain_type || 'pain';
}

function getZones(log = {}) {
  return log.zones || log.pain_zones || [];
}

function getStarted(log = {}) {
  return log.started || log.when_did_it_start || 'not recorded';
}

function getUrgency(log = {}) {
  const intensity = getIntensity(log);

  if (intensity >= HIGH_INTENSITY || textIncludesWatchWord(log)) {
    return {
      level: 'High attention',
      tone: 'high',
      summary: 'This report should be checked soon by a trusted adult or health professional.',
    };
  }

  if (intensity >= MODERATE_INTENSITY) {
    return {
      level: 'Keep watching',
      tone: 'medium',
      summary: 'The pain is noticeable. Track changes and compare it with the next report.',
    };
  }

  return {
    level: 'Low urgency',
    tone: 'low',
    summary: 'The report looks mild, but it is still useful to keep the pattern saved.',
  };
}

function getAnsweredRedFlags(answers = {}) {
  return RED_FLAG_KEYS.filter((key) => answers[key] === 'yes');
}

function getTrend(logs = []) {
  const usable = logs
    .filter((log) => log.created_at)
    .slice(0, 5)
    .map((log) => getIntensity(log));

  if (usable.length < 2) return 'Not enough reports yet to compare trends.';

  const newest = usable[0];
  const previous = usable.slice(1).reduce((sum, value) => sum + value, 0) / (usable.length - 1);

  if (newest >= previous + 2) return 'Pain is higher than recent reports.';
  if (newest <= previous - 2) return 'Pain is lower than recent reports.';
  return 'Pain is similar to recent reports.';
}

function getRecentSameAreaCount(log = {}, logs = []) {
  const currentZones = new Set(getZones(log));
  if (!currentZones.size) return 0;

  return logs
    .filter((item) => item.id !== log.id)
    .slice(0, 6)
    .filter((item) => getZones(item).some((zone) => currentZones.has(zone)))
    .length;
}

function getAssistantSignals({ log = {}, logs = [], answers = {} } = {}) {
  const intensity = getIntensity(log);
  const redFlags = getAnsweredRedFlags(answers);
  const sameAreaCount = getRecentSameAreaCount(log, logs);
  const noteHasWatchWord = textIncludesWatchWord(log);
  const missingFields = [
    !getZones(log).length && 'body area',
    !getPainType(log) && 'pain type',
    !getStarted(log) && 'start time',
    (intensity === 0 && intensity !== Number(log.intensity ?? log.pain_scale)) && 'pain score',
  ].filter(Boolean);

  const signals = [
    intensity >= HIGH_INTENSITY && 'high pain score',
    intensity >= MODERATE_INTENSITY && intensity < HIGH_INTENSITY && 'moderate pain score',
    sameAreaCount > 0 && 'same area appeared before',
    noteHasWatchWord && 'care note contains a warning word',
    redFlags.length > 0 && 'follow-up answers include warning signs',
    !missingFields.length && 'report has the key fields needed for a handoff',
  ].filter(Boolean);

  const confidenceScore = Math.max(
    45,
    Math.min(96, 58 + signals.length * 8 - missingFields.length * 7)
  );

  return {
    signals,
    redFlags,
    sameAreaCount,
    missingFields,
    confidenceScore,
    confidenceLabel:
      confidenceScore >= 82
        ? 'strong context'
        : confidenceScore >= 68
          ? 'usable context'
          : 'needs more detail',
  };
}

export function createCareInsight(log = {}) {
  const intensity = getIntensity(log);
  const painType = getPainType(log);
  const zones = getZones(log);
  const started = getStarted(log);
  const urgency = getUrgency(log);
  const zoneText = formatZones(zones);

  const nextSteps = [
    'Ask the child to point again and confirm the same spot.',
    intensity >= MODERATE_INTENSITY
      ? 'Check again within 30-60 minutes and save a follow-up report.'
      : 'Check again later today and add a new report if anything changes.',
    'Share the handoff note if you contact a caregiver, teacher, doctor, or nurse.',
  ];

  if (urgency.tone === 'high') {
    nextSteps.unshift('Contact a medical professional or urgent care service if this feels unusual or severe.');
  }

  const handoff = [
    `${log.childName || 'The child'} reported ${painType.toLowerCase()} in ${zoneText.toLowerCase()}.`,
    `Pain score: ${intensity || 'not recorded'} / 10.`,
    `Started: ${started}.`,
    log.notes ? `Caregiver note: ${log.notes}.` : 'No extra caregiver note was added.',
  ].join(' ');

  return {
    ...urgency,
    nextSteps,
    handoff,
  };
}

export function createAssistantAssessment({ log = {}, logs = [], answers = {} } = {}) {
  // The assistant is intentionally rules-based for the resit build: it creates
  // a real interactive care-support feature while staying explainable in the
  // technical interview. Red flags always override the base urgency level.
  const base = createCareInsight(log);
  const signals = getAssistantSignals({ log, logs, answers });
  const redFlags = signals.redFlags;
  const intensity = getIntensity(log);
  const hasRedFlags = redFlags.length > 0;
  const tone = hasRedFlags || intensity >= HIGH_INTENSITY ? 'high' : base.tone;
  const level = hasRedFlags ? 'Escalate care' : base.level;
  const summary = hasRedFlags
    ? 'Your follow-up answers include warning signs. A trusted adult should contact medical support now.'
    : base.summary;

  const questions = [
    { key: 'fever', label: 'Fever, vomiting, dizziness, or unusual tiredness?' },
    { key: 'injury', label: 'Pain started after a fall, hit, or accident?' },
    { key: 'breathing', label: 'Breathing trouble, chest pain, or fainting?' },
    { key: 'gettingWorse', label: 'Pain is getting worse or spreading?' },
    { key: 'canPlay', label: 'Child can still walk, talk, play, or rest normally?' },
  ];

  // The plan changes immediately as follow-up answers change, so the user can
  // see why Nana recommends either monitoring or escalating care.
  const carePlan = [
    hasRedFlags
      ? 'Contact a doctor, nurse, urgent care, or emergency support now.'
      : base.nextSteps[0],
    answers.canPlay === 'no'
      ? 'Keep the child close and avoid school, sports, or intense activity until checked.'
      : 'Keep the child comfortable and observe changes calmly.',
    intensity >= MODERATE_INTENSITY
      ? 'Create another Nana report within 30-60 minutes so the trend is visible.'
      : 'Create another Nana report later today if the pain changes.',
    'Use the handoff note when speaking with another caregiver or health professional.',
  ];

  return {
    ...base,
    tone,
    level,
    summary,
    questions,
    carePlan,
    trend: getTrend(logs),
    redFlags,
    signals,
  };
}

export function careInsightHtml(log = {}) {
  const insight = createCareInsight(log);

  return `
    <section class="ai-care-card ai-care-card--${insight.tone}" aria-label="Nana AI care insight">
      <div class="ai-care-card__top">
        <span class="ai-care-badge">Nana AI</span>
        <strong>${safeText(insight.level)}</strong>
      </div>
      <p>${safeText(insight.summary)}</p>
      <div class="ai-care-next">
        ${insight.nextSteps.map((step) => `<span>${safeText(step)}</span>`).join('')}
      </div>
      <label class="ai-care-handoff">
        <span>Doctor-ready handoff</span>
        <textarea readonly rows="4">${safeText(insight.handoff)}</textarea>
      </label>
      <div class="ai-care-actions">
        <button type="button" data-copy-handoff>Copy handoff</button>
        <button type="button" data-open-assistant>Open full assistant</button>
      </div>
      <small>This is decision support, not a diagnosis. In an emergency, contact local medical help.</small>
    </section>
  `;
}

export function wireCareInsightActions(root, { onCopied } = {}) {
  root.querySelectorAll('[data-copy-handoff]').forEach((button) => {
    button.addEventListener('click', async () => {
      const textarea = button.closest('.ai-care-card')?.querySelector('.ai-care-handoff textarea');
      const text = textarea?.value || '';

      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
      } catch {
        // Older embedded browsers may block Clipboard API. Keep a fallback so
        // the handoff can still be copied during a live demo.
        textarea?.select();
        document.execCommand?.('copy');
        button.textContent = 'Copied';
      }

      onCopied?.();

      setTimeout(() => {
        button.textContent = 'Copy handoff';
      }, 1200);
    });
  });

  root.querySelectorAll('[data-open-assistant]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.hash = '#assistant';
    });
  });
}
