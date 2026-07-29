import { ASSETS } from "../assets";
import { getActiveChild, updatePainDraft, appState } from "../appState";
import { childContextHtml, painProgressHtml } from "../sharedUi";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

const FILLS  = ["rgba(255,111,97,.55)"];
const BADGES = ["#FF6F61"];

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

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar show-pain-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>
    ${painProgressHtml(1)}
    <h1 class="show-pain-title">Where does it hurt?</h1>
    ${childContextHtml()}
    <p class="body-hint">Drag left or right to rotate. Drag up or down while zoomed to inspect the whole body.</p>
    <div class="body-map-wrap">
      <div class="body-svg-wrap" id="bodySvgWrap" style="position:relative;">
        <canvas id="bodyCanvas" style="width:100%;height:100%;display:block;touch-action:none;cursor:pointer;border-radius:16px;"></canvas>
        <div id="bodyLoading" class="body-loading" role="status" aria-live="polite">Loading model...</div>
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
  screen.querySelector(".show-pain-continue").addEventListener("click", () => { updatePainDraft({ zones: [...sel.keys()], view: "rotatable" }); window.location.hash = "#pain-type"; });

  const wrap      = screen.querySelector("#bodySvgWrap");
  const canvas    = screen.querySelector("#bodyCanvas");
  const loadingEl = screen.querySelector("#bodyLoading");
  const badgesEl  = screen.querySelector("#bodyBadges");
  const zlbl      = screen.querySelector("#zoomLabel");

  let isFront   = true;
  let modelYaw  = 0;
  const sel     = new Map((appState.painDraft?.zones || []).map(z => [z, 0]));
  let cidx      = 0;
  let hasTapped = false;   // pulse stops after first successful tap

  // Continuous camera distance (zoom). Start close enough that the body map is
  // the usable focal point, while the minus control still lets testers zoom out.
  let camDist = 1.55;
  const CAM_MIN = 0.62;
  const CAM_MAX = 2.45;
  const cameraTarget = { x: 0, y: 0 };

  let renderer, camera, scene, model, raycaster;
  let bodyMeshes = [];
  const overlays = [];

  // ── CDN loader ───────────────────────────────────────────────
  function setBodyLoading(message) {
    loadingEl.style.display = "flex";
    loadingEl.classList.remove("body-loading--error");
    loadingEl.innerHTML = `<span>${message}</span><i></i>`;
  }

  function setBodyLoadError(message) {
    loadingEl.style.display = "flex";
    loadingEl.classList.add("body-loading--error");
    loadingEl.innerHTML = `
      <span>${message}</span>
      <button type="button" class="body-loading-retry">Retry</button>
    `;
    loadingEl.querySelector(".body-loading-retry").addEventListener("click", () => {
      init();
    });
  }

  function activateBodyFallback(message) {
    canvas.style.display = "none";
    loadingEl.style.display = "none";
    loadingEl.classList.remove("body-loading--error");
    badgesEl.innerHTML = "";
    wrap.querySelector(".body-fallback-map")?.remove();

    const fallback = document.createElement("div");
    fallback.className = "body-fallback-map";
    fallback.innerHTML = `
      <p>${message}</p>
      <img src="${ASSETS.bodyFront}" alt="Body map fallback" />
      <button type="button" data-zone="head" style="left:50%;top:12%;">Head</button>
      <button type="button" data-zone="chest" style="left:50%;top:30%;">Chest</button>
      <button type="button" data-zone="tummy" style="left:50%;top:44%;">Tummy</button>
      <button type="button" data-zone="left-upper-arm" style="left:23%;top:36%;">Arm</button>
      <button type="button" data-zone="right-upper-arm" style="left:77%;top:36%;">Arm</button>
      <button type="button" data-zone="left-thigh" style="left:40%;top:67%;">Leg</button>
      <button type="button" data-zone="right-thigh" style="left:60%;top:67%;">Leg</button>
    `;

    fallback.querySelectorAll("[data-zone]").forEach((button) => {
      const zone = button.dataset.zone;
      button.classList.toggle("is-selected", sel.has(zone));
      button.addEventListener("click", () => {
        if (sel.has(zone)) {
          sel.delete(zone);
        } else {
          sel.set(zone, 0);
        }

        updatePainDraft({ zones: [...sel.keys()], view: "fallback" });
        fallback.querySelectorAll("[data-zone]").forEach((item) => {
          item.classList.toggle("is-selected", sel.has(item.dataset.zone));
        });
      });
    });

    wrap.append(fallback);
  }

  function loadScript(src, message) {
    setBodyLoading(message);

    return new Promise((resolve, reject) => {
      // Three.js is loaded only when the body map route is opened. That keeps
      // the first app load lighter, while these messages explain the delay.
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing?.dataset.loaded === "true") {
        resolve();
        return;
      }

      const script = existing || document.createElement("script");
      const timeout = window.setTimeout(() => {
        reject(new Error(`Timed out loading ${src}`));
      }, 15000);

      script.onload = () => {
        window.clearTimeout(timeout);
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error(`Could not load ${src}`));
      };
      script.src = src;

      if (!existing) document.head.appendChild(script);
    });
  }

  async function loadLibs() {
    if (window.THREE && window.THREE.GLTFLoader) return;

    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      "Loading 3D engine..."
    );

    await loadScript(
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
      "Preparing body map tools..."
    );
  }

  // ── Scene init ───────────────────────────────────────────────
  async function init() {
    setBodyLoading("Preparing 3D body map...");

    const rect  = wrap.getBoundingClientRect();
    const W = rect.width  || 300;
    const H = rect.height || 420;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
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

    setBodyLoading("Loading child body map...");

    // bodymap.glb lives in /public and is preloaded by main.js. This loader
    // still needs an error path because schools/test devices can have slow or
    // interrupted connections.
    new GLTFLoader().load("/bodymap.glb", gltf => {
      model = gltf.scene;
      model.scale.setScalar(MODEL_SCALE);
      model.position.set(0, -(MODEL_CENTRE_Y * MODEL_SCALE), 0);

      model.traverse(c => {
        if (!c.isMesh) return;
        c.castShadow = true;
        c.receiveShadow = true;
        c.material = new THREE.MeshStandardMaterial({
          color:     new THREE.Color(0xffd7a8),
          emissive:  new THREE.Color(0x2a1308),
          emissiveIntensity: 0.025,
          roughness: 0.66,
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
        if (model) model.rotation.y = modelYaw;
        renderer.render(scene, camera);
      })();

    }, undefined, err => {
      activateBodyFallback("Body map asset could not be loaded. Use this map.");
      console.error("GLB load error:", err);
    });
  }

  function positionCamera() {
    if (!camera) return;
    camera.position.set(0, 0, camDist);
    camera.lookAt(cameraTarget.x, cameraTarget.y, 0);
  }

  function clampDist(d) {
    return Math.max(CAM_MIN, Math.min(CAM_MAX, d));
  }

  function updateZoomLabel() {
    // Map camDist range (2.2=100% → 0.7=300%) to a readable %
    const pct = Math.round(100 * CAM_MAX / camDist);
    zlbl.textContent = pct + "%";
  }

  function clampPan() {
    const zoomed = (CAM_MAX - camDist) / (CAM_MAX - CAM_MIN);
    const limitX = 0.22 + zoomed * 0.22;
    const limitY = 0.24 + zoomed * 0.34;
    cameraTarget.x = Math.max(-limitX, Math.min(limitX, cameraTarget.x));
    cameraTarget.y = Math.max(-limitY, Math.min(limitY, cameraTarget.y));
  }

  function panCamera(dx, dy) {
    const panScale = camDist * 0.00135;
    cameraTarget.x -= dx * panScale;
    cameraTarget.y += dy * panScale;
    clampPan();
    positionCamera();
  }

  // ── Hit detection ────────────────────────────────────────────
  function commitZoneSelection(zone) {
    if (!zone) return;

    hasTapped = true;
    if (sel.has(zone)) {
      sel.delete(zone);
    } else {
      sel.set(zone, 0);
    }

    updatePainDraft({ zones: [...sel.keys()], view: "rotatable" });
    refreshOverlays();
    updateBadges();
  }

  function fallbackZoneFromCanvasPoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    // Finger taps on small screens can visually land on the body while missing
    // the exact mesh raycast. This maps the visible body back to the same zones.
    const bodyLeft = 0.20;
    const bodyRight = 0.80;
    const bodyTop = 0.10;
    const bodyBottom = 0.96;
    if (px < bodyLeft || px > bodyRight || py < bodyTop || py > bodyBottom) return null;

    const localX = (((px - bodyLeft) / (bodyRight - bodyLeft)) - 0.5) * 0.66;
    const localY = MODEL_LOCAL_Y_MAX - (((py - bodyTop) / (bodyBottom - bodyTop)) * MODEL_LOCAL_HEIGHT);
    return getZoneFromPoint({ x: localX, y: localY }, isFront);
  }

  function handleTap(clientX, clientY) {
    if (!model) return;
    const rect = canvas.getBoundingClientRect();
    const nx =  ((clientX - rect.left) / rect.width)  * 2 - 1;
    const ny = -((clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x: nx, y: ny }, camera);
    const hits = raycaster.intersectObject(model, true);
    if (!hits.length) {
      commitZoneSelection(fallbackZoneFromCanvasPoint(clientX, clientY));
      return;
    }

    // Convert the hit point back into original model-local space. The zone
    // thresholds below were tuned to the specific child body GLB dimensions.
    const origLocal = model.worldToLocal(hits[0].point.clone());
    const zoneSideIsFront = origLocal.z >= 0;
    isFront = zoneSideIsFront;

    commitZoneSelection(getZoneFromPoint(origLocal, zoneSideIsFront));
  }

  let suppressNextClick = false;
  canvas.addEventListener("click", e => {
    if (suppressNextClick) { suppressNextClick = false; return; }
    handleTap(e.clientX, e.clientY);
  });

  let pointerDrag = null;
  canvas.addEventListener("pointerdown", e => {
    pointerDrag = { x: e.clientX, y: e.clientY, yaw: modelYaw, moved: false };
    canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener("pointermove", e => {
    if (!pointerDrag) return;
    const dx = e.clientX - pointerDrag.x;
    const dy = e.clientY - pointerDrag.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) pointerDrag.moved = true;
    modelYaw = pointerDrag.yaw + dx * 0.01;
    if (Math.abs(dy) > 2) panCamera(0, e.movementY || dy * 0.08);
    if (model) model.rotation.y = modelYaw;
    refreshOverlays();
    updateBadges();
  });
  canvas.addEventListener("pointerup", e => {
    const wasTap = pointerDrag && !pointerDrag.moved;
    if (pointerDrag?.moved || wasTap) suppressNextClick = true;
    pointerDrag = null;
    canvas.releasePointerCapture?.(e.pointerId);
    if (wasTap) handleTap(e.clientX, e.clientY);
  });

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
      clampPan();
      positionCamera();
      updateZoomLabel();
      updateBadges();

    } else if (touchState.type === "single" && e.touches.length === 1) {
      const dy = e.touches[0].clientY - touchState.startY;
      const dx = e.touches[0].clientX - touchState.startX;
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8 || touchState.moved) {
        touchState.moved = true;
        modelYaw += dx * 0.0035;
        panCamera(0, dy * 0.025);
        if (model) model.rotation.y = modelYaw;
        updateBadges();
      }
    }
  }, { passive: false });

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    const state = touchState;
    touchState = null;
    if (window.PointerEvent) return;
    // Only fire tap if it was a single touch and barely moved
    if (state && state.type === "single" && !state.moved && e.changedTouches.length) {
      handleTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  }, { passive: false });

  // ── Mouse scroll wheel zoom (desktop) ────────────────────────
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    camDist = clampDist(camDist + e.deltaY * 0.002);
    clampPan();
    positionCamera();
    updateZoomLabel();
    updateBadges();
  }, { passive: false });

  // ── Zone overlays ────────────────────────────────────────────
  function localBoundToWorld(b) {
    if (!model) return { wx: b.x, wy: b.y, wz: b.z || 0, ww: b.w, wh: b.h, wd: b.d };
    const world = model.localToWorld(new THREE.Vector3(b.x, b.y, b.z || 0));
    return { wx: world.x, wy: world.y, wz: world.z, ww: b.w * MODEL_SCALE, wh: b.h * MODEL_SCALE, wd: b.d * MODEL_SCALE };
  }

  function refreshOverlays() {
    overlays.forEach(m => m.parent?.remove(m));
    overlays.length = 0;
  }

  // ── Badge labels ─────────────────────────────────────────────
  function updateBadges() {
    badgesEl.innerHTML = "";
    if (!camera || !renderer || !model) return;
    const rect = canvas.getBoundingClientRect();
    sel.forEach((ci, zone) => {
      const b = ZONE_BOUNDS_LOCAL[zone]; if (!b) return;
      const world = model.localToWorld(new THREE.Vector3(b.x, b.y, b.z || 0));
      const v = world.project(camera);
      if (v.z < -1 || v.z > 1) return;
      const px = ((v.x + 1) / 2) * rect.width;
      const py = ((-v.y + 1) / 2) * rect.height;
      const el = document.createElement("div");
      el.className = "body-zone-label";
      el.style.left = `${px}px`;
      el.style.top = `${py}px`;
      el.dataset.zone = zone;
      el.textContent = LABELS[zone] || zone;
      el.addEventListener("click", () => { sel.delete(zone); updatePainDraft({ zones: [...sel.keys()], view: 'rotatable' }); refreshOverlays(); updateBadges(); });
      badgesEl.appendChild(el);
    });
  }

  // ── Rotatable model: no front/back buttons.

  // ── Zoom buttons (step by 25% of range each press) ───────────
  const ZOOM_STEP = (CAM_MAX - CAM_MIN) * 0.22;
  screen.querySelector(".zoom-btn--minus").addEventListener("click", () => {
    camDist = clampDist(camDist + ZOOM_STEP);   // further away = zoom out
    if (camDist > 1.7) {
      cameraTarget.x = 0;
      cameraTarget.y = 0;
    }
    clampPan();
    positionCamera(); updateZoomLabel(); updateBadges();
  });
  screen.querySelector(".zoom-btn--plus").addEventListener("click", () => {
    camDist = clampDist(camDist - ZOOM_STEP);   // closer = zoom in
    clampPan();
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
  init().then(() => { setTimeout(() => { refreshOverlays(); updateBadges(); }, 500); });
}
