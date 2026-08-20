/*
  handover: body-map zone vocabulary
  - this is the shared source for the 3d body picker, mini review body, and backend sync payloads.
  - keep these labels, marker positions, and backend aliases together so the UI, saved reports, and backend manager speak the same language.
  - if the GLB model changes, update BODY_ZONE_BOUNDS_LOCAL and MINI_ZONE_POINTS in the same commit.
*/

export const BODY_ZONE_LABELS = {
  "head":              "Head",
  "back-head":         "Back of Head",
  "neck":              "Neck",
  "back-neck":         "Back of Neck",
  "left-shoulder":     "Left Shoulder",
  "right-shoulder":    "Right Shoulder",
  "chest":             "Chest",
  "tummy":             "Tummy",
  "groin":             "Groin",
  "upper-back":        "Upper Back",
  "lower-back":        "Lower Back",
  "left-glute":        "Left Bottom",
  "right-glute":       "Right Bottom",
  "left-upper-arm":    "Left Upper Arm",
  "right-upper-arm":   "Right Upper Arm",
  "left-forearm":      "Left Forearm",
  "right-forearm":     "Right Forearm",
  "left-hand":         "Left Hand",
  "right-hand":        "Right Hand",
  "left-hip":          "Left Hip",
  "right-hip":         "Right Hip",
  "left-thigh":        "Left Thigh",
  "right-thigh":       "Right Thigh",
  "left-hamstring":    "Left Hamstring",
  "right-hamstring":   "Right Hamstring",
  "left-knee":         "Left Knee",
  "right-knee":        "Right Knee",
  "left-back-knee":    "Left Back of Knee",
  "right-back-knee":   "Right Back of Knee",
  "left-shin":         "Left Shin",
  "right-shin":        "Right Shin",
  "left-calf":         "Left Calf",
  "right-calf":        "Right Calf",
  "left-ankle":        "Left Ankle",
  "right-ankle":       "Right Ankle",
  "left-foot":         "Left Foot",
  "right-foot":        "Right Foot",
  "left-heel":         "Left Heel",
  "right-heel":        "Right Heel",
};

// Local-space boxes for the GLB body model. The full picker uses these boxes to
// place readable badges over selected regions after the raycast picks a zone.
export const BODY_ZONE_BOUNDS_LOCAL = {
  "head":              { x: 0,      y: 0.99,  z: 0.06,  w:0.22, h:0.18, d:0.20 },
  "back-head":         { x: 0,      y: 0.99,  z:-0.03,  w:0.22, h:0.18, d:0.20 },
  "neck":              { x: 0,      y: 0.86,  z: 0.02,  w:0.09, h:0.09, d:0.09 },
  "back-neck":         { x: 0,      y: 0.86,  z:-0.02,  w:0.09, h:0.09, d:0.09 },
  "left-shoulder":     { x:-0.22,   y: 0.78,  z: 0,     w:0.12, h:0.10, d:0.12 },
  "right-shoulder":    { x: 0.22,   y: 0.78,  z: 0,     w:0.12, h:0.10, d:0.12 },
  "chest":             { x: 0,      y: 0.77,  z: 0.08,  w:0.30, h:0.11, d:0.10 },
  "tummy":             { x: 0,      y: 0.63,  z: 0.07,  w:0.28, h:0.12, d:0.10 },
  "groin":             { x: 0,      y: 0.50,  z: 0.06,  w:0.12, h:0.10, d:0.10 },
  "left-hip":          { x:-0.12,   y: 0.50,  z: 0.06,  w:0.14, h:0.10, d:0.10 },
  "right-hip":         { x: 0.12,   y: 0.50,  z: 0.06,  w:0.14, h:0.10, d:0.10 },
  "upper-back":        { x: 0,      y: 0.77,  z:-0.07,  w:0.30, h:0.11, d:0.10 },
  "lower-back":        { x: 0,      y: 0.63,  z:-0.06,  w:0.28, h:0.12, d:0.10 },
  "left-glute":        { x:-0.10,   y: 0.50,  z:-0.06,  w:0.14, h:0.10, d:0.10 },
  "right-glute":       { x: 0.10,   y: 0.50,  z:-0.06,  w:0.14, h:0.10, d:0.10 },
  "left-upper-arm":    { x:-0.26,   y: 0.66,  z: 0,     w:0.10, h:0.16, d:0.10 },
  "right-upper-arm":   { x: 0.26,   y: 0.66,  z: 0,     w:0.10, h:0.16, d:0.10 },
  "left-forearm":      { x:-0.27,   y: 0.49,  z: 0,     w:0.09, h:0.16, d:0.09 },
  "right-forearm":     { x: 0.27,   y: 0.49,  z: 0,     w:0.09, h:0.16, d:0.09 },
  "left-hand":         { x:-0.27,   y: 0.32,  z: 0,     w:0.09, h:0.09, d:0.08 },
  "right-hand":        { x: 0.27,   y: 0.32,  z: 0,     w:0.09, h:0.09, d:0.08 },
  "left-thigh":        { x:-0.10,   y: 0.33,  z: 0,     w:0.13, h:0.14, d:0.13 },
  "right-thigh":       { x: 0.10,   y: 0.33,  z: 0,     w:0.13, h:0.14, d:0.13 },
  "left-hamstring":    { x:-0.10,   y: 0.33,  z:-0.05,  w:0.13, h:0.14, d:0.13 },
  "right-hamstring":   { x: 0.10,   y: 0.33,  z:-0.05,  w:0.13, h:0.14, d:0.13 },
  "left-knee":         { x:-0.09,   y: 0.23,  z: 0.02,  w:0.10, h:0.08, d:0.09 },
  "right-knee":        { x: 0.09,   y: 0.23,  z: 0.02,  w:0.10, h:0.08, d:0.09 },
  "left-back-knee":    { x:-0.09,   y: 0.23,  z:-0.04,  w:0.10, h:0.08, d:0.09 },
  "right-back-knee":   { x: 0.09,   y: 0.23,  z:-0.04,  w:0.10, h:0.08, d:0.09 },
  "left-shin":         { x:-0.09,   y: 0.14,  z: 0.02,  w:0.09, h:0.12, d:0.09 },
  "right-shin":        { x: 0.09,   y: 0.14,  z: 0.02,  w:0.09, h:0.12, d:0.09 },
  "left-calf":         { x:-0.09,   y: 0.14,  z:-0.04,  w:0.09, h:0.12, d:0.09 },
  "right-calf":        { x: 0.09,   y: 0.14,  z:-0.04,  w:0.09, h:0.12, d:0.09 },
  "left-ankle":        { x:-0.08,   y: 0.05,  z: 0.01,  w:0.08, h:0.05, d:0.08 },
  "right-ankle":       { x: 0.08,   y: 0.05,  z: 0.01,  w:0.08, h:0.05, d:0.08 },
  "left-foot":         { x:-0.08,   y: 0.02,  z: 0.05,  w:0.09, h:0.05, d:0.15 },
  "right-foot":        { x: 0.08,   y: 0.02,  z: 0.05,  w:0.09, h:0.05, d:0.15 },
  "left-heel":         { x:-0.08,   y: 0.02,  z:-0.04,  w:0.09, h:0.05, d:0.10 },
  "right-heel":        { x: 0.08,   y: 0.02,  z:-0.04,  w:0.09, h:0.05, d:0.10 },
};

// Local-space marker anchors for the small review/summary body. They mirror the
// selectable regions above but are tuned for tiny, non-interactive previews.
export const MINI_ZONE_POINTS = {
  head: { x: 0, y: 0.99, z: 0.1 },
  "back-head": { x: 0, y: 0.99, z: -0.09 },
  neck: { x: 0, y: 0.86, z: 0.1 },
  "back-neck": { x: 0, y: 0.86, z: -0.09 },
  chest: { x: 0, y: 0.76, z: 0.12 },
  tummy: { x: 0, y: 0.62, z: 0.12 },
  groin: { x: 0, y: 0.5, z: 0.1 },
  "upper-back": { x: 0, y: 0.76, z: -0.1 },
  "lower-back": { x: 0, y: 0.62, z: -0.1 },
  "left-shoulder": { x: -0.18, y: 0.78, z: 0.06 },
  "right-shoulder": { x: 0.18, y: 0.78, z: 0.06 },
  "left-upper-arm": { x: -0.25, y: 0.66, z: 0.04 },
  "right-upper-arm": { x: 0.25, y: 0.66, z: 0.04 },
  "left-forearm": { x: -0.28, y: 0.49, z: 0.04 },
  "right-forearm": { x: 0.28, y: 0.49, z: 0.04 },
  "left-hand": { x: -0.29, y: 0.32, z: 0.04 },
  "right-hand": { x: 0.29, y: 0.32, z: 0.04 },
  "left-hip": { x: -0.12, y: 0.5, z: 0.1 },
  "right-hip": { x: 0.12, y: 0.5, z: 0.1 },
  "left-glute": { x: -0.11, y: 0.5, z: -0.1 },
  "right-glute": { x: 0.11, y: 0.5, z: -0.1 },
  "left-thigh": { x: -0.09, y: 0.34, z: 0.08 },
  "right-thigh": { x: 0.09, y: 0.34, z: 0.08 },
  "left-hamstring": { x: -0.09, y: 0.34, z: -0.08 },
  "right-hamstring": { x: 0.09, y: 0.34, z: -0.08 },
  "left-knee": { x: -0.08, y: 0.23, z: 0.08 },
  "right-knee": { x: 0.08, y: 0.23, z: 0.08 },
  "left-back-knee": { x: -0.08, y: 0.23, z: -0.08 },
  "right-back-knee": { x: 0.08, y: 0.23, z: -0.08 },
  "left-shin": { x: -0.08, y: 0.14, z: 0.07 },
  "right-shin": { x: 0.08, y: 0.14, z: 0.07 },
  "left-calf": { x: -0.08, y: 0.14, z: -0.07 },
  "right-calf": { x: 0.08, y: 0.14, z: -0.07 },
  "left-ankle": { x: -0.08, y: 0.05, z: 0.06 },
  "right-ankle": { x: 0.08, y: 0.05, z: 0.06 },
  "left-foot": { x: -0.08, y: 0.02, z: 0.11 },
  "right-foot": { x: 0.08, y: 0.02, z: 0.11 },
  "left-heel": { x: -0.08, y: 0.02, z: -0.08 },
  "right-heel": { x: 0.08, y: 0.02, z: -0.08 },
};

const BACK_VIEW_ZONES = new Set([
  'back-head',
  'back-neck',
  'upper-back',
  'lower-back',
  'left-glute',
  'right-glute',
  'left-hamstring',
  'right-hamstring',
  'left-back-knee',
  'right-back-knee',
  'left-calf',
  'right-calf',
  'left-heel',
  'right-heel',
]);

const BACKEND_ZONE_ALIASES = {
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

export function bodyZoneSide(zoneId) {
  return BACK_VIEW_ZONES.has(String(zoneId || '')) ? 'back' : 'front';
}

export function normalizeBackendZone(zoneId, intensity) {
  const zone = BACKEND_ZONE_ALIASES[zoneId] || zoneId;
  const painLevel = Math.max(0, Math.min(4, Math.round((Number(intensity || 0) / 10) * 4)));

  return {
    zone_id: zone,
    side: bodyZoneSide(zoneId),
    pain_level: painLevel,
  };
}
