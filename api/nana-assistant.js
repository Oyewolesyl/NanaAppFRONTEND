const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

function trimText(value, fallback = '') {
  return String(value || fallback).replace(/\s+/g, ' ').trim().slice(0, 1600);
}

function buildPrompt({ question, report, assessment }) {
  const childName = trimText(report?.childName || report?.child_name, 'this child');
  const painType = trimText(report?.painType || report?.pain_type, 'pain');
  const zonesValue = report?.zones || report?.pain_zones;
  const zones = Array.isArray(zonesValue)
    ? zonesValue.join(', ')
    : trimText(zonesValue, 'not recorded');
  const intensity = Number(report?.intensity ?? report?.pain_scale ?? 0) || 0;
  const started = trimText(report?.started || report?.when_did_it_start, 'not recorded');

  return [
    'you are nana assistant, a warm child-health support chatbot for caregivers.',
    'your job is to explain the saved pain report, suggest what to watch, prepare a clear handoff note, and ask sensible follow-up questions.',
    'you must not diagnose, prescribe medication, or replace medical care.',
    'if the report suggests severe pain, worsening symptoms, breathing trouble, fever, vomiting, dizziness, unusual tiredness, or caregiver concern, advise contacting a trusted adult or medical professional promptly.',
    'keep the answer short, practical, and grounded only in the supplied report.',
    `child: ${childName}`,
    `pain type: ${painType}`,
    `pain areas: ${zones || 'not recorded'}`,
    `pain score: ${intensity}/10`,
    `started: ${started}`,
    `current app assessment: ${trimText(assessment?.summary, 'no app assessment')}`,
    `handoff draft: ${trimText(assessment?.handoff, 'no handoff draft')}`,
    `care plan: ${Array.isArray(assessment?.carePlan) ? assessment.carePlan.map((item) => trimText(item)).join(' | ') : 'not available'}`,
    `caregiver question: ${trimText(question)}`,
  ].join('\n');
}

async function callOpenAI(payload) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: buildPrompt(payload),
      temperature: 0.25,
      max_output_tokens: 360,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`assistant api failed: ${response.status} ${detail.slice(0, 180)}`);
  }

  const data = await response.json();
  return trimText(data.output_text || data.output?.[0]?.content?.[0]?.text || '');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const payload = request.body || {};
    const question = trimText(payload?.question);
    if (!question) {
      return response.status(400).json({ error: 'missing_question' });
    }

    const reply = await callOpenAI(payload);
    if (!reply) {
      return response.status(503).json({ error: 'assistant_not_configured' });
    }

    return response.status(200).json({ reply });
  } catch (error) {
    return response.status(500).json({
      error: 'assistant_failed',
      message: trimText(error?.message, 'unknown error'),
    });
  }
}
