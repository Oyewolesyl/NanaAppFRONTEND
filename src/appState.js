import { createBackendChild, createBackendPainLog, getStoredAccessToken } from './backendApi';

const K = {
  children: 'nana_children_v3',
  activeChildId: 'nana_active_child_id_v3',
  caregiver: 'nana_caregiver_v3',
  painDraft: 'nana_pain_draft_v3',
  painLogs: 'nana_pain_logs_v3',
  role: 'nana_role_v3',
};

// localStorage keeps the app responsive offline and during testing. When a user
// is signed in, the same records are mirrored to the Render/Supabase backend so
// the backend manager can document real children and pain reports.
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
    backend_id: child.backend_id || child.remote_id || child.backendId || null,
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
  syncChildToBackend(safe).catch(() => {});

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
    syncPainLogToBackend(merged).catch(() => {});

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
  syncPainLogToBackend(log).catch(() => {});

  return log;
}

export function setRole(role) {
  appState.role = role;
  write(K.role, role);
}

function zoneSide(zoneId) {
  return String(zoneId || '').startsWith('back-') ||
    ['upper-back', 'lower-back', 'left-glute', 'right-glute', 'left-hamstring', 'right-hamstring', 'left-calf', 'right-calf', 'left-heel', 'right-heel'].includes(zoneId)
    ? 'back'
    : 'front';
}

function normalizeBackendZone(zoneId, intensity) {
  const aliases = {
    tummy: 'abdomen',
    'left-upper-arm': 'left-arm',
    'right-upper-arm': 'right-arm',
    'left-hip': 'hips',
    'right-hip': 'hips',
    'left-glute': 'glutes',
    'right-glute': 'glutes',
    'left-knee': 'left-shin',
    'right-knee': 'right-shin',
    'left-back-knee': 'left-calf',
    'right-back-knee': 'right-calf',
    'left-ankle': 'left-foot',
    'right-ankle': 'right-foot',
  };

  const zone = aliases[zoneId] || zoneId;
  const painLevel = Math.max(0, Math.min(4, Math.round((Number(intensity || 0) / 10) * 4)));

  return {
    zone_id: zone,
    side: zoneSide(zoneId),
    pain_level: painLevel,
  };
}

function persistChildren() {
  write(K.children, appState.children);
  write(K.activeChildId, appState.activeChildId);
}

function persistPainLogs() {
  write(K.painLogs, appState.painLogs);
}

export async function syncChildToBackend(child) {
  if (!getStoredAccessToken() || !child || child.backend_id) return child;

  const remote = await createBackendChild(child);
  const index = appState.children.findIndex((item) => item.id === child.id);

  if (index >= 0) {
    appState.children[index] = {
      ...appState.children[index],
      backend_id: remote.id,
    };
    persistChildren();
  }

  return remote;
}

export async function syncPainLogToBackend(log) {
  if (!getStoredAccessToken() || !log || log.backend_id) return log;

  const child = appState.children.find((item) => item.id === (log.childId || log.child_id));
  if (child && !child.backend_id) {
    await syncChildToBackend(child);
  }

  const syncedChild = appState.children.find((item) => item.id === (log.childId || log.child_id));
  const backendChildId = syncedChild?.backend_id;

  if (!backendChildId) return log;

  const zones = [...new Set(log.zones || [])].map((zone) => normalizeBackendZone(zone, log.intensity));
  const remote = await createBackendPainLog({
    child_id: backendChildId,
    zones,
    pain_type: log.painType || log.pain_type || 'other',
    when_did_it_start: log.started || log.when_did_it_start || '',
    pain_scale: Number(log.intensity ?? log.pain_scale ?? 0),
    notes: log.notes || '',
  });

  const index = appState.painLogs.findIndex((item) => item.id === log.id);

  if (index >= 0) {
    appState.painLogs[index] = {
      ...appState.painLogs[index],
      backend_id: remote.id,
    };
    persistPainLogs();
  }

  return remote;
}

export async function syncLocalDataToBackend() {
  if (!getStoredAccessToken()) return;

  for (const child of appState.children) {
    await syncChildToBackend(child);
  }

  for (const log of appState.painLogs) {
    await syncPainLogToBackend(log);
  }
}
