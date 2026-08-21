import { ASSETS } from "../assets";
import { getActiveChild, updatePainDraft, appState } from "../appState";
import { childContextHtml, painProgressHtml } from "../sharedUi";
import { BODY_ZONE_LABELS as LABELS, BODY_ZONE_BOUNDS_LOCAL as ZONE_BOUNDS_LOCAL } from "../bodyMap/bodyZones.js";

let THREE;
let GLTFLoader;

async function loadBodyMapEngine() {
  if (THREE && GLTFLoader) return;

  const threeModule = await import("three");
  const loaderModule = await import("three/examples/jsm/loaders/GLTFLoader.js");

  THREE = threeModule;
  GLTFLoader = loaderModule.GLTFLoader;
}

const FILLS  = ["rgba(255,111,97,.55)"];
const BADGES = ["#FF6F61"];

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
      <button type="button" class="zoom-btn zoom-btn--minus" aria-label="Zoom out">-</button>
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
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  // Continuous camera distance (zoom). Start close enough that the body map is
  // the usable focal point, while the minus control still lets testers zoom out.
  let camDist = 1.36;
  const CAM_MIN = 0.62;
  const CAM_MAX = 2.45;
  const cameraTarget = { x: 0, y: 0 };

  let renderer, camera, scene, model, raycaster;
  let bodyMeshes = [];
  const overlays = [];
  // Scene status and fallback handling.
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

  // ── Scene init ───────────────────────────────────────────────
  async function init() {
    setBodyLoading("Preparing 3D body map...");
    try {
      await loadBodyMapEngine();
    } catch (error) {
      activateBodyFallback("3D body map could not start. Use this map.");
      console.error("Body map engine load error:", error);
      return;
    }

    const rect  = wrap.getBoundingClientRect();
    const W = rect.width  || 300;
    const H = rect.height || 420;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (error) {
      activateBodyFallback("3D body map is not available on this device. Use this map.");
      console.error("WebGL renderer error:", error);
      return;
    }
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
        if (!hasTapped && !reduceMotion) {
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

  function isZoneOnVisibleSide(zone, front) {
    const isBackZone = zone.includes("back") ||
      zone.includes("glute") ||
      zone.includes("hamstring") ||
      zone.includes("calf") ||
      zone.includes("heel");

    return front ? !isBackZone : isBackZone;
  }

  function nearestZoneFromPoint(point, front) {
    let bestZone = null;
    let bestScore = Infinity;

    Object.entries(ZONE_BOUNDS_LOCAL).forEach(([zone, box]) => {
      if (!isZoneOnVisibleSide(zone, front)) return;

      const dx = Math.abs(point.x - box.x) / Math.max(box.w, 0.08);
      const dy = Math.abs(point.y - box.y) / Math.max(box.h, 0.06);
      const score = dx * dx + dy * dy;

      if (score < bestScore) {
        bestScore = score;
        bestZone = zone;
      }
    });

    return bestScore <= 6.5 ? bestZone : null;
  }

  function getZoneFromPoint(point, front) {
    for (const [zone, box] of Object.entries(ZONE_BOUNDS_LOCAL)) {
      if (!isZoneOnVisibleSide(zone, front)) continue;

      const inX = Math.abs(point.x - box.x) <= box.w / 2;
      const inY = Math.abs(point.y - box.y) <= box.h / 2;
      const inZ = typeof point.z !== "number" || Math.abs(point.z - (box.z || 0)) <= Math.max(box.d || 0.1, 0.12);

      if (inX && inY && inZ) return zone;
    }

    return nearestZoneFromPoint(point, front);
  }

  function handleTap(clientX, clientY) {
    if (!model || !camera) {
      commitZoneSelection(fallbackZoneFromCanvasPoint(clientX, clientY));
      return;
    }
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
    // Mobile browsers differ in how reliably they emit pointerup after a
    // prevented touch gesture. Treat a quiet one-finger touchend as a real body
    // selection so the 3D map never advances with "No spot selected" after a tap.
    if (state && state.type === "single" && !state.moved && e.changedTouches.length) {
      suppressNextClick = true;
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
