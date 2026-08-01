const ASSISTANT_TIMEOUT_MS = 7600;

function localFallback(question, fallbackAnswer) {
  return Promise.resolve(fallbackAnswer(question));
}

function getAssistantEndpoint() {
  return import.meta.env.VITE_NANA_AI_ENDPOINT || '/api/nana-assistant';
}

export async function askNanaAssistant({ question, log, assessment, fallbackAnswer }) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), ASSISTANT_TIMEOUT_MS);

  try {
    const response = await fetch(getAssistantEndpoint(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        question,
        report: log,
        assessment,
      }),
    });

    if (!response.ok) {
      return localFallback(question, fallbackAnswer);
    }

    const data = await response.json();
    const reply = String(data.reply || '').trim();
    return reply || localFallback(question, fallbackAnswer);
  } catch (error) {
    return localFallback(question, fallbackAnswer);
  } finally {
    window.clearTimeout(timeout);
  }
}
