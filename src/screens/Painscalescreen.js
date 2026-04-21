import { createStatusBar } from "../components/statusBar";
import { ASSETS } from "../assets";

/* ─── Mini body SVG (front view, read-only, shows selected zones) ── */
function makeMiniBody(selectedZones = []) {
  const fills = ["rgba(255,80,60,.55)","rgba(255,165,30,.55)","rgba(30,185,100,.55)","rgba(50,140,255,.55)","rgba(180,70,220,.55)"];
  const highlighted = new Set(selectedZones);

  const zFill = (name) => highlighted.has(name) ? fills[0] : "transparent";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 360" style="width:100%;height:100%;display:block">
<defs><style>
.b{fill:#FFE8A0;stroke:#48AFA2;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.j{fill:#FFD870;stroke:#48AFA2;stroke-width:1.5}
</style></defs>
<!-- HEAD -->
<ellipse class="b" cx="100" cy="30" rx="28" ry="30"/>
<ellipse class="b" cx="72" cy="30" rx="5" ry="6.5"/>
<ellipse class="b" cx="128" cy="30" rx="5" ry="6.5"/>
<!-- face -->
<circle fill="#3a2a18" cx="88" cy="28" r="4"/>
<circle fill="#3a2a18" cx="112" cy="28" r="4"/>
<circle fill="#fff" cx="89.5" cy="26.5" r="1.6"/>
<circle fill="#fff" cx="113.5" cy="26.5" r="1.6"/>
<circle fill="#c07850" cx="100" cy="34" r="2.2"/>
<path fill="none" stroke="#c07850" stroke-width="2" stroke-linecap="round" d="M92 41 Q100 48 108 41"/>
<ellipse fill="#f0a888" opacity=".55" cx="81" cy="38" rx="7" ry="5"/>
<ellipse fill="#f0a888" opacity=".55" cx="119" cy="38" rx="7" ry="5"/>
<!-- NECK -->
<rect class="b" x="92" y="58" width="16" height="16" rx="6"/>
<!-- TORSO -->
<rect class="b" x="44" y="70" width="112" height="72" rx="20"/>
<line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="4 3" opacity=".4" x1="46" y1="108" x2="154" y2="108"/>
<!-- HIPS -->
<rect class="b" x="42" y="138" width="116" height="48" rx="22"/>
<!-- LEFT ARM -->
<rect class="b" x="20" y="72" width="26" height="60" rx="13"/>
<ellipse class="j" cx="33" cy="134" rx="11" ry="8"/>
<rect class="b" x="17" y="140" width="22" height="56" rx="11"/>
<ellipse class="j" cx="28" cy="197" rx="9" ry="6"/>
<ellipse class="b" cx="28" cy="212" rx="14" ry="16"/>
<!-- RIGHT ARM -->
<rect class="b" x="154" y="72" width="26" height="60" rx="13"/>
<ellipse class="j" cx="167" cy="134" rx="11" ry="8"/>
<rect class="b" x="161" y="140" width="22" height="56" rx="11"/>
<ellipse class="j" cx="172" cy="197" rx="9" ry="6"/>
<ellipse class="b" cx="172" cy="212" rx="14" ry="16"/>
<!-- LEFT THIGH -->
<rect class="b" x="46" y="182" width="34" height="68" rx="17"/>
<ellipse class="j" cx="63" cy="252" rx="14" ry="9"/>
<!-- RIGHT THIGH -->
<rect class="b" x="120" y="182" width="34" height="68" rx="17"/>
<ellipse class="j" cx="137" cy="252" rx="14" ry="9"/>
<!-- LEFT SHIN -->
<rect class="b" x="48" y="258" width="30" height="68" rx="15"/>
<ellipse class="j" cx="63" cy="328" rx="12" ry="7"/>
<!-- RIGHT SHIN -->
<rect class="b" x="122" y="258" width="30" height="68" rx="15"/>
<ellipse class="j" cx="137" cy="328" rx="12" ry="7"/>
<!-- LEFT FOOT -->
<ellipse class="b" cx="60" cy="340" rx="20" ry="11"/>
<!-- RIGHT FOOT -->
<ellipse class="b" cx="140" cy="340" rx="20" ry="11"/>
<!-- HIGHLIGHT ZONES -->
<ellipse fill="${zFill("head")}"      cx="100" cy="30"  rx="32" ry="34"/>
<rect    fill="${zFill("chest")}"     x="42"  y="70"  width="116" height="40" rx="4"/>
<rect    fill="${zFill("abdomen")}"   x="42"  y="108" width="116" height="34" rx="4"/>
<rect    fill="${zFill("hips")}"      x="40"  y="140" width="120" height="46" rx="4"/>
<rect    fill="${zFill("left-arm")}"  x="20"  y="72"  width="24"  height="68" rx="12"/>
<rect    fill="${zFill("right-arm")}" x="156" y="72"  width="24"  height="68" rx="12"/>
<rect    fill="${zFill("left-forearm")}"  x="16"  y="144" width="22" height="58" rx="11"/>
<rect    fill="${zFill("right-forearm")}" x="162" y="144" width="22" height="58" rx="11"/>
<ellipse fill="${zFill("left-hand")}"  cx="27"  cy="216" rx="16" ry="14"/>
<ellipse fill="${zFill("right-hand")}" cx="173" cy="216" rx="16" ry="14"/>
<rect    fill="${zFill("left-thigh")}"  x="44"  y="184" width="36" height="72" rx="4"/>
<rect    fill="${zFill("right-thigh")}" x="120" y="184" width="36" height="72" rx="4"/>
<rect    fill="${zFill("left-shin")}"   x="44"  y="258" width="36" height="72" rx="4"/>
<rect    fill="${zFill("right-shin")}"  x="120" y="258" width="36" height="72" rx="4"/>
<ellipse fill="${zFill("left-foot")}"  cx="62"  cy="344" rx="22" ry="12"/>
<ellipse fill="${zFill("right-foot")}" cx="138" cy="344" rx="22" ry="12"/>
</svg>`;
}

/* ─── Pain face SVGs 1-10 ────────────────────────────────────────── */
function makeFace(level) {
  const color = level <= 2 ? "#50C890"
              : level <= 4 ? "#90C840"
              : level <= 6 ? "#FFB830"
              : level <= 8 ? "#FF8030"
              : "#FF3830";

  // mouth path: big smile (1) → flat (5) → big frown (10)
  const t = (level - 1) / 9; // 0..1
  // control point y: smile = cy+12, flat = cy, frown = cy-12
  const mouthCtrlY = 52 - (t * 24 - 12); // 64 at t=0, 52 at t=0.5, 28 at t=1... let me recalc
  // smile: M32,52 Q40,64 48,52   frown: M32,52 Q40,40 48,52
  const ctrlY = 64 - t * 24; // 64→40

  // eyes: happy=arc-down, sad=arc-up
  const eyeStroke = color;
  const leftEye  = t < 0.5
    ? `<path d="M28 32 Q32 28 36 32" stroke="${eyeStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<path d="M28 30 Q32 34 36 30" stroke="${eyeStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const rightEye = t < 0.5
    ? `<path d="M44 32 Q48 28 52 32" stroke="${eyeStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<path d="M44 30 Q48 34 52 30" stroke="${eyeStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

  // sweat drop for high pain
  const sweat = level >= 8
    ? `<ellipse cx="56" cy="26" rx="3" ry="4" fill="#8CC8FF" opacity="0.8"/>
       <polygon points="56,20 53,26 59,26" fill="#8CC8FF" opacity="0.8"/>`
    : "";

  // tears for max pain
  const tears = level >= 9
    ? `<ellipse cx="30" cy="42" rx="2" ry="3" fill="#8CC8FF" opacity="0.7"/>
       <ellipse cx="50" cy="42" rx="2" ry="3" fill="#8CC8FF" opacity="0.7"/>`
    : "";

  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <circle cx="40" cy="40" r="34" fill="${color}" opacity="0.18"/>
    <circle cx="40" cy="40" r="26" fill="${color}" opacity="0.9"/>
    ${leftEye}
    ${rightEye}
    <path d="M32,52 Q40,${ctrlY} 48,52" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${sweat}
    ${tears}
    <text x="40" y="76" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="${color}">${level}</text>
  </svg>`;
}

export function renderPainScaleScreen(app, { painDesc = "", selectedZones = [], fromScreen = "#when-did-it-start" } = {}) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen pain-scale-screen";
  screen.append(createStatusBar());

  const subtitle = painDesc ? `<p class="pain-scale-subtitle">(${painDesc})</p>` : "";

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar pain-scale-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>

    <div class="pain-scale-body-wrap">
      <div class="pain-scale-body-svg" id="miniBody">${makeMiniBody(selectedZones)}</div>
    </div>

    <div class="pain-scale-heading-wrap">
      <h1 class="pain-scale-title">How much is the pain?</h1>
      ${subtitle}
    </div>

    <div class="pain-scale-face-wrap">
      <div class="pain-scale-face" id="painFace">${makeFace(1)}</div>
    </div>

    <div class="pain-scale-slider-wrap">
      <input
        type="range"
        class="pain-slider"
        id="painSlider"
        min="1" max="10" value="1" step="1"
        aria-label="Pain level"
      />
      <div class="pain-slider-labels">
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
      </div>
    </div>

    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn">Next</button>
    </div>
  `);

  const slider   = screen.querySelector("#painSlider");
  const faceWrap = screen.querySelector("#painFace");

  function update() {
    const val = Number(slider.value);
    faceWrap.innerHTML = makeFace(val);
    // update slider fill
    const pct = ((val - 1) / 9) * 100;
    slider.style.setProperty("--fill", `${pct}%`);
  }

  slider.addEventListener("input", update);
  update();

  screen.querySelector(".back-button").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });
  screen.querySelector(".pain-type-back-btn").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });
  screen.querySelector(".pain-type-next-btn").addEventListener("click", () => {
    window.location.hash = "#pain-summary";
  });

  app.append(screen);
}