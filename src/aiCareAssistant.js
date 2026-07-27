import { formatZones } from './sharedUi';

const HIGH_INTENSITY = 8;
const MODERATE_INTENSITY = 5;
const WATCH_WORDS = ['fever', 'vomit', 'vomiting', 'bleeding', 'dizzy', 'faint', 'swelling', 'breathing'];

function safeText(value, fallback = '') {
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
      <small>This is decision support, not a diagnosis. In an emergency, contact local medical help.</small>
    </section>
  `;
}
