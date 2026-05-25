const K = {
  children: 'nana_children_v3',
  activeChildId: 'nana_active_child_id_v3',
  caregiver: 'nana_caregiver_v3',
  painDraft: 'nana_pain_draft_v3',
  painLogs: 'nana_pain_logs_v3',
  role: 'nana_role_v3',
};

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }

const defaultChildren = [
  { id: 'sunny', name: 'Sunny', age: 4, photo_url: '/child1.svg', conditions: '', medications: '', notes: '' },
];

function normalizeChild(child = {}) {
  const rawName = typeof child.name === 'string' ? child.name.trim() : '';
  return {
    id: child.id || uid('child'),
    name: rawName || 'Child',
    age: Math.min(18, Math.max(1, Number(child.age || 4))),
    photo_url: child.photo_url || child.photoUrl || '/inactivechildpicture.svg',
    conditions: child.conditions || '',
    medications: child.medications || '',
    notes: child.notes || '',
  };
}
function dedupe(children) {
  const map = new Map();
  children.map(normalizeChild).forEach((child) => map.set(String(child.id), child));
  return [...map.values()];
}

const emptyPainDraft = () => ({ zones: [], view: 'front', painType: '', started: '', intensity: null, notes: '' });

export const appState = {
  role: read(K.role, 'guardian'),
  caregiver: read(K.caregiver, { name: 'Caregiver', email: '', phone: '', notifications: true }),
  children: dedupe(read(K.children, defaultChildren)),
  activeChildId: read(K.activeChildId, 'sunny'),
  painDraft: { ...emptyPainDraft(), ...read(K.painDraft, emptyPainDraft()) },
  painLogs: read(K.painLogs, []),
};
if (!appState.children.length) appState.children = defaultChildren;
if (!appState.children.some(c => c.id === appState.activeChildId)) appState.activeChildId = appState.children[0]?.id || null;
write(K.children, appState.children);
write(K.activeChildId, appState.activeChildId);
write(K.painDraft, appState.painDraft);

export function getActiveChild() {
  return appState.children.find(c => c.id === appState.activeChildId) || appState.children[0] || null;
}
export function setActiveChild(idOrChild) {
  const id = typeof idOrChild === 'object' ? idOrChild?.id : idOrChild;
  if (id) { appState.activeChildId = id; write(K.activeChildId, id); }
  return getActiveChild();
}
export function saveChild(child) {
  const safe = normalizeChild(child);
  const index = appState.children.findIndex(c => c.id === safe.id);
  if (index >= 0) appState.children[index] = { ...appState.children[index], ...safe };
  else appState.children.push(safe);
  appState.children = dedupe(appState.children);
  appState.activeChildId = safe.id;
  write(K.children, appState.children);
  write(K.activeChildId, appState.activeChildId);
  return safe;
}
export function removeChild(id) {
  appState.children = appState.children.filter(c => c.id !== id);
  if (appState.activeChildId === id) appState.activeChildId = appState.children[0]?.id || null;
  write(K.children, appState.children);
  write(K.activeChildId, appState.activeChildId);
}
export function updateCaregiver(patch) {
  appState.caregiver = { ...appState.caregiver, ...patch };
  write(K.caregiver, appState.caregiver);
}
export function updatePainDraft(patch) {
  const zones = patch.zones ? [...new Set(patch.zones)] : undefined;
  appState.painDraft = { ...appState.painDraft, ...patch, ...(zones ? { zones } : {}) };
  write(K.painDraft, appState.painDraft);
}
export function resetPainDraft() {
  appState.painDraft = emptyPainDraft();
  write(K.painDraft, appState.painDraft);
}
export function savePainLog() {
  const child = getActiveChild();
  const log = {
    id: uid('pain'),
    childId: child?.id,
    childName: child?.name || 'Child',
    childPhoto: child?.photo_url || '/inactivechildpicture.svg',
    created_at: new Date().toISOString(),
    ...appState.painDraft,
    zones: [...new Set(appState.painDraft.zones || [])],
  };
  appState.painLogs.unshift(log);
  write(K.painLogs, appState.painLogs);
  resetPainDraft();
  return log;
}
export function reopenPainLogForMoreSpots(logId) {
  const index = appState.painLogs.findIndex(log => log.id === logId);
  if (index < 0) return null;
  const [log] = appState.painLogs.splice(index, 1);
  appState.activeChildId = log.childId || appState.activeChildId;
  appState.painDraft = {
    zones: [...new Set(log.zones || [])],
    view: log.view || 'front',
    painType: log.painType || '',
    started: log.started || '',
    intensity: log.intensity ?? null,
    notes: log.notes || '',
  };
  write(K.painLogs, appState.painLogs);
  write(K.activeChildId, appState.activeChildId);
  write(K.painDraft, appState.painDraft);
  return appState.painDraft;
}
export function setRole(role) { appState.role = role; write(K.role, role); }
