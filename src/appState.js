const K = {
  children: 'nana_children_v3',
  activeChildId: 'nana_active_child_id_v3',
  caregiver: 'nana_caregiver_v3',
  painDraft: 'nana_pain_draft_v3',
  painLogs: 'nana_pain_logs_v3',
  role: 'nana_role_v3',
};

// This prototype runs without a backend for the core pain-report flow, so
// localStorage is the source of truth for demo/resit data. Versioned keys let
// future schema changes reset safely without corrupting older browser data.
function hasStored(key) {
  return localStorage.getItem(key) !== null;
}

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const defaultChildren = [
  {
    id: 'sunny',
    name: 'Sunny',
    age: 4,
    photo_url: '/child1.svg',
    conditions: '',
    medications: '',
    notes: '',
  },
];

function cleanName(name) {
  return String(name || '').trim();
}

function normalizeChild(child = {}) {
  const name = cleanName(child.name);

  return {
    id: child.id || uid('child'),
    name: name || 'Child',
    age: Math.max(1, Math.min(18, Number(child.age || 4))),
    photo_url: child.photo_url || child.photoUrl || child.photo || '/inactivechildpicture.svg',
    conditions: child.conditions || '',
    medications: child.medications || '',
    notes: child.notes || '',
  };
}

function dedupe(children) {
  const map = new Map();

  children
    .map(normalizeChild)
    .forEach((child) => {
      map.set(String(child.id), child);
    });

  return [...map.values()];
}

function defaultPainDraft() {
  return {
    zones: [],
    view: 'rotatable',
    painType: '',
    started: '',
    intensity: null,
    notes: '',
  };
}

const initialChildren = hasStored(K.children)
  ? read(K.children, [])
  : defaultChildren;

export const appState = {
  role: read(K.role, 'guardian'),
  caregiver: read(K.caregiver, {
    name: 'Caregiver',
    email: '',
    phone: '',
    notifications: true,
  }),
  children: dedupe(initialChildren),
  activeChildId: read(K.activeChildId, null),
  painDraft: read(K.painDraft, defaultPainDraft()),
  painLogs: read(K.painLogs, []),
};

// Always keep an active child when possible. Many screens assume a selected
// child so that reports, body-map selections, and assistant handoffs stay tied
// to the correct profile.
if (appState.children.length && !appState.children.some((c) => c.id === appState.activeChildId)) {
  appState.activeChildId = appState.children[0].id;
}

if (!appState.children.length) {
  appState.activeChildId = null;
}

write(K.children, appState.children);
write(K.activeChildId, appState.activeChildId);
write(K.painDraft, appState.painDraft);

export function getActiveChild() {
  return appState.children.find((c) => c.id === appState.activeChildId) || appState.children[0] || null;
}

export function setActiveChild(idOrChild) {
  const id = typeof idOrChild === 'object' ? idOrChild?.id : idOrChild;

  if (id) {
    appState.activeChildId = id;
    write(K.activeChildId, id);
  }

  return getActiveChild();
}

export function saveChild(child) {
  const existing = child?.id
    ? appState.children.find((c) => c.id === child.id)
    : null;

  const safe = normalizeChild({
    ...existing,
    ...child,
  });

  const index = appState.children.findIndex((c) => c.id === safe.id);

  if (index >= 0) {
    appState.children[index] = safe;
  } else {
    appState.children.push(safe);
  }

  appState.children = dedupe(appState.children);
  appState.activeChildId = safe.id;

  appState.painLogs = appState.painLogs.map((log) => {
    if (log.childId !== safe.id && log.child_id !== safe.id) return log;

    return {
      ...log,
      childId: safe.id,
      childName: safe.name,
      childPhoto: safe.photo_url,
    };
  });

  write(K.children, appState.children);
  write(K.activeChildId, appState.activeChildId);
  write(K.painLogs, appState.painLogs);

  window.dispatchEvent(new CustomEvent('nana:children-updated', { detail: safe }));

  return safe;
}

export function removeChild(id) {
  appState.children = appState.children.filter((c) => c.id !== id);

  appState.painLogs = appState.painLogs.filter((log) => (
    log.childId !== id &&
    log.child_id !== id
  ));

  if (appState.activeChildId === id) {
    appState.activeChildId = appState.children[0]?.id || null;
  }

  write(K.children, appState.children);
  write(K.activeChildId, appState.activeChildId);
  write(K.painLogs, appState.painLogs);

  window.dispatchEvent(new CustomEvent('nana:children-updated'));
}

export function updateCaregiver(patch) {
  appState.caregiver = {
    ...appState.caregiver,
    ...patch,
  };

  write(K.caregiver, appState.caregiver);
}

export function updatePainDraft(patch) {
  // Zones are stored as a set because the 3D body map can be tapped multiple
  // times while rotating. Dedupe here keeps every later screen simple.
  const zones = patch?.zones
    ? [...new Set(patch.zones)]
    : appState.painDraft.zones;

  appState.painDraft = {
    ...appState.painDraft,
    ...patch,
    zones,
  };

  write(K.painDraft, appState.painDraft);
}

export function resetPainDraft() {
  appState.painDraft = defaultPainDraft();
  write(K.painDraft, appState.painDraft);
}

export function loadPainDraftFromLog(log) {
  if (!log) {
    resetPainDraft();
    return;
  }

  appState.painDraft = {
    zones: [...new Set(log.zones || [])],
    view: 'rotatable',
    painType: log.painType || '',
    started: log.started || '',
    intensity: log.intensity ?? null,
    notes: log.notes || '',
  };

  write(K.painDraft, appState.painDraft);
}

export function savePainLog({ extendLogId } = {}) {
  const child = getActiveChild();

  const draft = {
    ...appState.painDraft,
    zones: [...new Set(appState.painDraft.zones || [])],
    notes: String(appState.painDraft.notes || '').trim(),
  };

  const existingId = extendLogId || sessionStorage.getItem('nana_extend_log_id');
  const existingIndex = existingId
    ? appState.painLogs.findIndex((x) => x.id === existingId)
    : -1;

  if (existingIndex >= 0) {
    const previous = appState.painLogs[existingIndex];

    const merged = {
      ...previous,
      ...draft,
      childId: previous.childId || child?.id,
      childName: previous.childName || child?.name || 'Child',
      childPhoto: previous.childPhoto || child?.photo_url || '/inactivechildpicture.svg',
      zones: [...new Set([...(previous.zones || []), ...(draft.zones || [])])],
      updated_at: new Date().toISOString(),
    };

    appState.painLogs[existingIndex] = merged;

    write(K.painLogs, appState.painLogs);
    sessionStorage.removeItem('nana_extend_log_id');
    resetPainDraft();

    return merged;
  }

  const log = {
    id: uid('pain'),
    childId: child?.id,
    childName: child?.name || 'Child',
    childPhoto: child?.photo_url || '/inactivechildpicture.svg',
    created_at: new Date().toISOString(),
    ...draft,
  };

  appState.painLogs.unshift(log);

  write(K.painLogs, appState.painLogs);
  sessionStorage.removeItem('nana_extend_log_id');
  resetPainDraft();

  return log;
}

export function setRole(role) {
  appState.role = role;
  write(K.role, role);
}
