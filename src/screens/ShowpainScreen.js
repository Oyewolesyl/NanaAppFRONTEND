import { createStatusBar } from "../components/statusBar";
import { ASSETS } from "../assets";

/* ── Labels (child-friendly + clinically accurate) ─────────────── */
const LABELS = {
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

const FILLS  = ["rgba(255,80,60,.7)","rgba(255,165,30,.7)","rgba(30,185,100,.7)","rgba(50,140,255,.7)","rgba(180,70,220,.7)"];
const BADGES = ["#d42810","#c87800","#18904a","#1870d0","#9020b8"];

/* ── Zone detection — ORIGINAL model local space ──────────────────
   GLB accessor bounds:
     Y: 0.001 → 1.100  (0 = feet, 1.1 = crown)
     X: -0.341 → +0.341 (negative = model's LEFT arm)
     Z: -0.062 → +0.221 (positive = front of body)
   ────────────────────────────────────────────────────────────────*/
function getZoneFromPoint(pt, isFront) {
  const x = pt.x, y = pt.y;

  // ── Head / neck
  if (y > 0.93)                          return isFront ? "head" : "back-head";
  if (y > 0.82 && Math.abs(x) < 0.09)   return isFront ? "neck" : "back-neck";

  // ── Shoulders (outer upper torso / arm junction)
  if (Math.abs(x) > 0.16 && y > 0.76) {
    return (x < 0 ? "left" : "right") + "-shoulder";
  }

  // ── Arms (outside torso, below shoulder)
  // Lower X threshold so narrow arm geometry is easier to tap
  if (Math.abs(x) > 0.16) {
    const s = x < 0 ? "left" : "right";
    if (y > 0.64) return `${s}-upper-arm`;
    if (y > 0.44) return `${s}-forearm`;
    return `${s}-hand`;
  }

  // ── Torso centre
  // chest: upper torso, tighter — stops well above navel
  if (y > 0.76) return isFront ? "chest"   : "upper-back";
  // tummy: mid torso, nudged up toward chest
  if (y > 0.60) return isFront ? "tummy"   : "lower-back";

  // ── Hip / groin / glute belt
  // groin sits just below tummy (0.46–0.60), nudged toward tummy not privates
  if (y > 0.46) {
    if (isFront) {
      if (Math.abs(x) < 0.07) return "groin";
      return (x < 0 ? "left" : "right") + "-hip";
    }
    return (x < 0 ? "left" : "right") + "-glute";
  }

  // ── Legs
  const s = x < 0 ? "left" : "right";
  if (y > 0.28) return isFront ? `${s}-thigh`     : `${s}-hamstring`;
  if (y > 0.21) return isFront ? `${s}-knee`      : `${s}-back-knee`;
  if (y > 0.09) return isFront ? `${s}-shin`      : `${s}-calf`;
  if (y > 0.04) return `${s}-ankle`;
  return isFront ? `${s}-foot` : `${s}-heel`;
}

/* ── Zone bounding boxes — ORIGINAL model local space ──────────── */
const ZONE_BOUNDS_LOCAL = {
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

// Model constants from GLB accessor
const MODEL_LOCAL_Y_MIN  = 0.0008;
const MODEL_LOCAL_Y_MAX  = 1.1005;
const MODEL_LOCAL_HEIGHT = MODEL_LOCAL_Y_MAX - MODEL_LOCAL_Y_MIN;
const MODEL_SCALE        = 1.8 / MODEL_LOCAL_HEIGHT;
const MODEL_CENTRE_Y     = (MODEL_LOCAL_Y_MIN + MODEL_LOCAL_Y_MAX) / 2;

export function renderShowPainScreen(app, { fromScreen = "#child-added" } = {}) {
  app.innerHTML = "";
  const screen = document.createElement("main");
  screen.className = "screen show-pain-screen";
  screen.append(createStatusBar());

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar show-pain-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>
    <h1 class="show-pain-title">Where does it hurt?</h1>
    <div class="body-toggle" role="group" aria-label="Body view">
      <button type="button" class="body-toggle-btn body-toggle-btn--active" data-view="front">Front</button>
      <button type="button" class="body-toggle-btn" data-view="back">Back</button>
    </div>
    <p class="body-hint">Tap the place that hurts</p>
    <div class="body-map-wrap">
      <div class="body-svg-wrap" id="bodySvgWrap" style="position:relative;">
        <canvas id="bodyCanvas" style="width:100%;height:100%;display:block;touch-action:none;cursor:pointer;border-radius:16px;"></canvas>
        <div id="bodyLoading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#48AFA2;font-family:Nunito,sans-serif;font-size:14px;font-weight:700;pointer-events:none;">Loading model…</div>
        <div id="bodyBadges" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>
      </div>
    </div>
    <div class="zoom-row">
      <button type="button" class="zoom-btn zoom-btn--minus" aria-label="Zoom out">−</button>
      <span class="zoom-label" id="zoomLabel">100%</span>
      <button type="button" class="zoom-btn zoom-btn--plus" aria-label="Zoom in">+</button>
    </div>
    <button type="button" class="continue-button show-pain-continue">Continue</button>
  `);

  screen.querySelector(".back-button").addEventListener("click",  () => { window.location.hash = fromScreen; });
  screen.querySelector(".show-pain-continue").addEventListener("click", () => { window.location.hash = "#pain-type"; });

  const wrap      = screen.querySelector("#bodySvgWrap");
  const canvas    = screen.querySelector("#bodyCanvas");
  const loadingEl = screen.querySelector("#bodyLoading");
  const badgesEl  = screen.querySelector("#bodyBadges");
  const zlbl      = screen.querySelector("#zoomLabel");

  let isFront   = true;
  const sel     = new Map();
  let cidx      = 0;
  let hasTapped = false;   // pulse stops after first successful tap

  // Continuous camera distance (zoom). Range: 0.7 (close) – 2.2 (far)
  let camDist = 2.0;
  const CAM_MIN = 0.7;
  const CAM_MAX = 2.2;

  let renderer, camera, scene, model, raycaster;
  let bodyMeshes = [];
  const overlays = [];

  // ── CDN loader ───────────────────────────────────────────────
  function loadLibs() {
    return new Promise(resolve => {
      if (window.THREE && window.THREE.GLTFLoader) { resolve(); return; }
      const s1 = document.createElement("script");
      s1.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s1.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
        s2.onload = resolve;
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    });
  }

  // ── Scene init ───────────────────────────────────────────────
  async function init() {
    await loadLibs();
    const THREE = window.THREE;
    const rect  = wrap.getBoundingClientRect();
    const W = rect.width  || 300;
    const H = rect.height || 420;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);

    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(58, W / H, 0.01, 100);
    positionCamera();

    scene.add(new THREE.AmbientLight(0xfff8f0, 0.7));
    const key = new THREE.DirectionalLight(0xfff4e0, 1.5);
    key.position.set(1.5, 3, 2.5); key.castShadow = true; scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.6);
    fill.position.set(-2, 1, -1); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.25);
    rim.position.set(0, -2, -3); scene.add(rim);

    raycaster = new THREE.Raycaster();

    new THREE.GLTFLoader().load("/bodymap.glb", gltf => {
      model = gltf.scene;
      model.scale.setScalar(MODEL_SCALE);
      model.position.set(0, -(MODEL_CENTRE_Y * MODEL_SCALE), 0);

      model.traverse(c => {
        if (!c.isMesh) return;
        c.castShadow = true;
        c.receiveShadow = true;
        c.material = new THREE.MeshStandardMaterial({
          color:     new THREE.Color(0xf0b882),
          emissive:  new THREE.Color(0x000000),
          roughness: 0.55,
          metalness: 0.0,
        });
        bodyMeshes.push(c);
      });

      scene.add(model);
      loadingEl.style.display = "none";

      // ── Render + pulse loop ─────────────────────────────────
      const PULSE_COLOR = new THREE.Color(0x48AFA2);   // teal
      const BLACK       = new THREE.Color(0x000000);

      (function loop(ts) {
        requestAnimationFrame(loop);
        if (!hasTapped) {
          // Smooth sine wave: peaks every ~2 s, intensity 0–0.18
          const t = (ts || 0) * 0.0015;
          const intensity = Math.pow(Math.sin(t * Math.PI), 2) * 0.18;
          bodyMeshes.forEach(m => {
            m.material.emissive.lerpColors(BLACK, PULSE_COLOR, intensity);
          });
        } else {
          bodyMeshes.forEach(m => m.material.emissive.set(0x000000));
        }
        renderer.render(scene, camera);
      })();

    }, undefined, err => {
      loadingEl.textContent = "Place bodymap.glb in /public folder";
      console.error("GLB load error:", err);
    });
  }

  function positionCamera() {
    if (!camera) return;
    camera.position.set(0, 0, isFront ? camDist : -camDist);
    camera.lookAt(0, 0, 0);
  }

  function clampDist(d) {
    return Math.max(CAM_MIN, Math.min(CAM_MAX, d));
  }

  function updateZoomLabel() {
    // Map camDist range (2.2=100% → 0.7=300%) to a readable %
    const pct = Math.round(100 * CAM_MAX / camDist);
    zlbl.textContent = pct + "%";
  }

  // ── Hit detection ────────────────────────────────────────────
  function handleTap(clientX, clientY) {
    if (!model) return;
    const THREE = window.THREE;
    const rect = canvas.getBoundingClientRect();
    const nx =  ((clientX - rect.left) / rect.width)  * 2 - 1;
    const ny = -((clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x: nx, y: ny }, camera);
    const hits = raycaster.intersectObject(model, true);
    if (!hits.length) return;

    // Reverse model transform → original local space
    const wp = hits[0].point.clone();
    const origLocal = new THREE.Vector3(
      wp.x / MODEL_SCALE,
      (wp.y - model.position.y) / MODEL_SCALE,
      wp.z / MODEL_SCALE
    );

    const zone = getZoneFromPoint(origLocal, isFront);
    if (!zone) return;

    hasTapped = true;
    if (sel.has(zone)) { sel.delete(zone); } else { sel.set(zone, cidx++ % FILLS.length); }
    refreshOverlays();
    updateBadges();
  }

  canvas.addEventListener("click", e => handleTap(e.clientX, e.clientY));

  // ── Touch: pinch-to-zoom + single-finger drag-to-zoom + tap ──
  let touchState = null;   // tracks ongoing touch gesture

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      touchState = {
        type: "single",
        startY: e.touches[0].clientY,
        startX: e.touches[0].clientX,
        startDist: camDist,
        moved: false,
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchState = {
        type: "pinch",
        startSpread: Math.hypot(dx, dy),
        startDist: camDist,
      };
    }
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!touchState) return;

    if (touchState.type === "pinch" && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const spread = Math.hypot(dx, dy);
      // Larger spread = zoomed in = smaller camDist
      camDist = clampDist(touchState.startDist * (touchState.startSpread / spread));
      positionCamera();
      updateZoomLabel();
      updateBadges();

    } else if (touchState.type === "single" && e.touches.length === 1) {
      const dy = e.touches[0].clientY - touchState.startY;
      const dx = e.touches[0].clientX - touchState.startX;
      // Only trigger drag-zoom if primarily vertical movement
      if (Math.abs(dy) > 8 || touchState.moved) {
        touchState.moved = true;
        // Drag down = zoom in (smaller dist), drag up = zoom out
        camDist = clampDist(touchState.startDist + dy * 0.004);
        positionCamera();
        updateZoomLabel();
        updateBadges();
      }
    }
  }, { passive: false });

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    const state = touchState;
    touchState = null;
    // Only fire tap if it was a single touch and barely moved
    if (state && state.type === "single" && !state.moved && e.changedTouches.length) {
      handleTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  }, { passive: false });

  // ── Mouse scroll wheel zoom (desktop) ────────────────────────
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    camDist = clampDist(camDist + e.deltaY * 0.002);
    positionCamera();
    updateZoomLabel();
    updateBadges();
  }, { passive: false });

  // ── Zone overlays ────────────────────────────────────────────
  function localBoundToWorld(b, frontFace) {
    const S  = MODEL_SCALE;
    const Py = model ? model.position.y : -(MODEL_CENTRE_Y * MODEL_SCALE);
    return {
      wx: b.x * S,
      wy: b.y * S + Py,
      wz: (frontFace ? b.z : -b.z) * S,
      ww: b.w * S, wh: b.h * S, wd: b.d * S,
    };
  }

  function refreshOverlays() {
    const THREE = window.THREE;
    overlays.forEach(m => scene.remove(m));
    overlays.length = 0;
    sel.forEach((ci, zone) => {
      const b = ZONE_BOUNDS_LOCAL[zone]; if (!b) return;
      const w = localBoundToWorld(b, isFront);
      const rgb = FILLS[ci].match(/[\d.]+/g);
      const color = new THREE.Color(+rgb[0]/255, +rgb[1]/255, +rgb[2]/255);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w.ww, w.wh, w.wd),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, depthWrite: false })
      );
      mesh.position.set(w.wx, w.wy, w.wz);
      scene.add(mesh);
      overlays.push(mesh);
    });
  }

  // ── Badge labels ─────────────────────────────────────────────
  function updateBadges() {
    badgesEl.innerHTML = "";
    if (!camera || !renderer) return;
    const THREE = window.THREE;
    const rect = canvas.getBoundingClientRect();
    sel.forEach((ci, zone) => {
      const b = ZONE_BOUNDS_LOCAL[zone]; if (!b) return;
      const w = localBoundToWorld(b, isFront);
      const v = new THREE.Vector3(w.wx, w.wy, w.wz).project(camera);
      const px = ((v.x + 1) / 2) * rect.width;
      const py = ((-v.y + 1) / 2) * rect.height;
      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;left:${px}px;top:${py}px;
        transform:translate(-50%,-50%);
        background:${BADGES[ci]};color:#fff;
        font-family:Nunito,sans-serif;font-size:11px;font-weight:700;
        padding:3px 9px;border-radius:10px;
        border:1.5px solid rgba(255,255,255,0.9);
        white-space:nowrap;pointer-events:auto;cursor:pointer;
        box-shadow:0 2px 6px rgba(0,0,0,0.25);
      `;
      el.textContent = LABELS[zone] || zone;
      el.addEventListener("click", () => { sel.delete(zone); refreshOverlays(); updateBadges(); });
      badgesEl.appendChild(el);
    });
  }

  // ── Front / Back toggle ──────────────────────────────────────
  screen.querySelectorAll(".body-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      screen.querySelectorAll(".body-toggle-btn").forEach(b => b.classList.remove("body-toggle-btn--active"));
      btn.classList.add("body-toggle-btn--active");
      isFront = btn.dataset.view === "front";
      positionCamera();
      refreshOverlays();
      updateBadges();
    });
  });

  // ── Zoom buttons (step by 25% of range each press) ───────────
  const ZOOM_STEP = (CAM_MAX - CAM_MIN) * 0.22;
  screen.querySelector(".zoom-btn--minus").addEventListener("click", () => {
    camDist = clampDist(camDist + ZOOM_STEP);   // further away = zoom out
    positionCamera(); updateZoomLabel(); updateBadges();
  });
  screen.querySelector(".zoom-btn--plus").addEventListener("click", () => {
    camDist = clampDist(camDist - ZOOM_STEP);   // closer = zoom in
    positionCamera(); updateZoomLabel(); updateBadges();
  });

  // ── Resize ───────────────────────────────────────────────────
  new ResizeObserver(() => {
    if (!renderer || !camera) return;
    const r = wrap.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    updateBadges();
  }).observe(wrap);

  app.append(screen);
  init();
}