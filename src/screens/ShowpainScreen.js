import { createStatusBar } from "../components/statusBar";
import { ASSETS } from "../assets";

const LABELS = {
  head:"Head","back-head":"Head (back)",neck:"Neck",
  chest:"Chest",abdomen:"Tummy","upper-back":"Upper Back","lower-back":"Lower Back",
  hips:"Hips",glutes:"Bottom",
  "left-arm":"Left Arm","right-arm":"Right Arm",
  "left-forearm":"L. Forearm","right-forearm":"R. Forearm",
  "left-hand":"Left Hand","right-hand":"Right Hand",
  "left-thigh":"L. Thigh","right-thigh":"R. Thigh",
  "left-hamstring":"L. Hamstring","right-hamstring":"R. Hamstring",
  "left-shin":"Left Shin","right-shin":"Right Shin",
  "left-calf":"Left Calf","right-calf":"Right Calf",
  "left-foot":"Left Foot","right-foot":"Right Foot",
  "left-heel":"Left Heel","right-heel":"Right Heel",
};
const FILLS  = ["rgba(255,80,60,.42)","rgba(255,165,30,.42)","rgba(30,185,100,.42)","rgba(50,140,255,.42)","rgba(180,70,220,.42)"];
const BADGES = ["#d42810","#c87800","#18904a","#1870d0","#9020b8"];

/* ─── Body SVG ───────────────────────────────────────────────────
   viewBox: 0 0 200 400
   Centre line: x = 100
   Everything is strictly mirrored. Uses rounded rects + ellipses
   for a clean, friendly, child-appropriate look.
   No freehand paths — purely geometric so nothing can go crooked.
──────────────────────────────────────────────────────────────── */
function makeSVG(isFront) {
  const face = isFront ? `
    <!-- eyes -->
    <circle fill="#3a2a18" cx="88" cy="28" r="4"/>
    <circle fill="#3a2a18" cx="112" cy="28" r="4"/>
    <circle fill="#fff" cx="89.5" cy="26.5" r="1.6"/>
    <circle fill="#fff" cx="113.5" cy="26.5" r="1.6"/>
    <!-- nose -->
    <circle fill="#c07850" cx="100" cy="34" r="2.2"/>
    <!-- smile -->
    <path fill="none" stroke="#c07850" stroke-width="2" stroke-linecap="round" d="M92 41 Q100 48 108 41"/>
    <!-- cheeks -->
    <ellipse fill="#f0a888" opacity=".55" cx="81" cy="38" rx="7" ry="5"/>
    <ellipse fill="#f0a888" opacity=".55" cx="119" cy="38" rx="7" ry="5"/>
  ` : `
    <!-- hair swirl on back -->
    <path fill="none" stroke="#c89050" stroke-width="2" stroke-linecap="round" opacity=".5"
      d="M94 18 Q100 12 106 18 Q112 26 100 28 Q91 26 94 18"/>
  `;

  const torsoDetail = isFront ? `
    <line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="4 3" opacity=".4" x1="46" y1="108" x2="154" y2="108"/>
  ` : `
    <!-- spine -->
    <line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="3 3" opacity=".4" x1="100" y1="72" x2="100" y2="138"/>
    <!-- shoulder blades — same ellipse, perfectly symmetric -->
    <ellipse fill="#FFD870" stroke="#48AFA2" stroke-width="1.2" cx="81" cy="98" rx="14" ry="18" opacity=".75"/>
    <ellipse fill="#FFD870" stroke="#48AFA2" stroke-width="1.2" cx="119" cy="98" rx="14" ry="18" opacity=".75"/>
    <!-- glute line -->
    <line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="3 3" opacity=".35" x1="100" y1="140" x2="100" y2="184"/>
  `;

  /* Zone names differ front vs back */
  const z = (name, shape) => `<${shape} class="z" data-zone="${name}"`;

  const frontZones = `
    ${z("head","ellipse")} cx="100" cy="30" rx="32" ry="34"/>
    ${z("neck","rect")} x="91" y="62" width="18" height="14" rx="6"/>
    ${z("chest","rect")} x="42" y="70" width="116" height="40" rx="4"/>
    ${z("abdomen","rect")} x="42" y="108" width="116" height="34" rx="4"/>
    ${z("hips","rect")} x="40" y="140" width="120" height="46" rx="4"/>
    ${z("left-arm","rect")} x="20" y="72" width="24" height="68" rx="12"/>
    ${z("right-arm","rect")} x="156" y="72" width="24" height="68" rx="12"/>
    ${z("left-forearm","rect")} x="16" y="144" width="22" height="58" rx="11"/>
    ${z("right-forearm","rect")} x="162" y="144" width="22" height="58" rx="11"/>
    ${z("left-hand","ellipse")} cx="27" cy="216" rx="16" ry="14"/>
    ${z("right-hand","ellipse")} cx="173" cy="216" rx="16" ry="14"/>
    ${z("left-thigh","rect")} x="44" y="184" width="36" height="72" rx="4"/>
    ${z("right-thigh","rect")} x="120" y="184" width="36" height="72" rx="4"/>
    ${z("left-shin","rect")} x="44" y="258" width="36" height="72" rx="4"/>
    ${z("right-shin","rect")} x="120" y="258" width="36" height="72" rx="4"/>
    ${z("left-foot","ellipse")} cx="62" cy="344" rx="22" ry="12"/>
    ${z("right-foot","ellipse")} cx="138" cy="344" rx="22" ry="12"/>
  `;

  const backZones = `
    ${z("back-head","ellipse")} cx="100" cy="30" rx="32" ry="34"/>
    ${z("neck","rect")} x="91" y="62" width="18" height="14" rx="6"/>
    ${z("upper-back","rect")} x="42" y="70" width="116" height="40" rx="4"/>
    ${z("lower-back","rect")} x="42" y="108" width="116" height="34" rx="4"/>
    ${z("glutes","rect")} x="40" y="140" width="120" height="46" rx="4"/>
    ${z("left-shoulder","rect")} x="20" y="72" width="24" height="68" rx="12"/>
    ${z("right-shoulder","rect")} x="156" y="72" width="24" height="68" rx="12"/>
    ${z("left-forearm","rect")} x="16" y="144" width="22" height="58" rx="11"/>
    ${z("right-forearm","rect")} x="162" y="144" width="22" height="58" rx="11"/>
    ${z("left-hand","ellipse")} cx="27" cy="216" rx="16" ry="14"/>
    ${z("right-hand","ellipse")} cx="173" cy="216" rx="16" ry="14"/>
    ${z("left-hamstring","rect")} x="44" y="184" width="36" height="72" rx="4"/>
    ${z("right-hamstring","rect")} x="120" y="184" width="36" height="72" rx="4"/>
    ${z("left-calf","rect")} x="44" y="258" width="36" height="72" rx="4"/>
    ${z("right-calf","rect")} x="120" y="258" width="36" height="72" rx="4"/>
    ${z("left-heel","ellipse")} cx="62" cy="344" rx="22" ry="12"/>
    ${z("right-heel","ellipse")} cx="138" cy="344" rx="22" ry="12"/>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 360" style="width:100%;height:100%;display:block">
<defs><style>
.b{fill:#FFE8A0;stroke:#48AFA2;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.j{fill:#FFD870;stroke:#48AFA2;stroke-width:1.5}
.z{fill:transparent;cursor:pointer}.z:hover{fill:rgba(255,90,70,.2)}
</style></defs>

<!-- HEAD -->
<ellipse class="b" cx="100" cy="30" rx="28" ry="30"/>
<ellipse class="b" cx="72"  cy="30" rx="5"  ry="6.5"/>
<ellipse class="b" cx="128" cy="30" rx="5"  ry="6.5"/>
${face}

<!-- NECK -->
<rect class="b" x="92" y="58" width="16" height="16" rx="6"/>

<!-- TORSO: x=44 to x=156, perfectly centred -->
<rect class="b" x="44" y="70" width="112" height="72" rx="20"/>
${torsoDetail}

<!-- HIPS: same width band -->
<rect class="b" x="42" y="138" width="116" height="48" rx="22"/>

<!-- LEFT ARM (x=20..44) — mirror of right (x=156..180) -->
<rect class="b" x="20" y="72" width="26" height="60" rx="13"/>
<ellipse class="j" cx="33" cy="134" rx="11" ry="8"/>
<rect class="b" x="17" y="140" width="22" height="56" rx="11"/>
<ellipse class="j" cx="28" cy="197" rx="9"  ry="6"/>
<ellipse class="b" cx="28" cy="212" rx="14" ry="16"/>

<!-- RIGHT ARM (mirror: 200-20=180, 200-44=156) -->
<rect class="b" x="154" y="72" width="26" height="60" rx="13"/>
<ellipse class="j" cx="167" cy="134" rx="11" ry="8"/>
<rect class="b" x="161" y="140" width="22" height="56" rx="11"/>
<ellipse class="j" cx="172" cy="197" rx="9"  ry="6"/>
<ellipse class="b" cx="172" cy="212" rx="14" ry="16"/>

<!-- LEFT THIGH (x=46..80) — mirror of right (x=120..154) -->
<rect class="b" x="46" y="182" width="34" height="68" rx="17"/>
<ellipse class="j" cx="63" cy="252" rx="14" ry="9"/>

<!-- RIGHT THIGH (mirror) -->
<rect class="b" x="120" y="182" width="34" height="68" rx="17"/>
<ellipse class="j" cx="137" cy="252" rx="14" ry="9"/>

<!-- LEFT SHIN (same x as thigh) -->
<rect class="b" x="48" y="258" width="30" height="68" rx="15"/>
<ellipse class="j" cx="63" cy="328" rx="12" ry="7"/>

<!-- RIGHT SHIN (mirror) -->
<rect class="b" x="122" y="258" width="30" height="68" rx="15"/>
<ellipse class="j" cx="137" cy="328" rx="12" ry="7"/>

<!-- LEFT FOOT -->
<ellipse class="b" cx="60" cy="340" rx="20" ry="11"/>

<!-- RIGHT FOOT (mirror: 200-60=140) -->
<ellipse class="b" cx="140" cy="340" rx="20" ry="11"/>

<!-- ZONES -->
${isFront ? frontZones : backZones}
</svg>`;
}

const ZOOMS      = ["0 0 200 360","15 20 170 306","35 60 130 234","50 100 100 180"];
const ZOOM_LABEL = ["100%","118%","154%","200%"];

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
      <div class="body-svg-wrap" id="bodySvgWrap">${makeSVG(true)}</div>
    </div>
    <div class="zoom-row">
      <button type="button" class="zoom-btn zoom-btn--minus" aria-label="Zoom out">−</button>
      <span class="zoom-label" id="zoomLabel">100%</span>
      <button type="button" class="zoom-btn zoom-btn--plus" aria-label="Zoom in">+</button>
    </div>
    <button type="button" class="continue-button show-pain-continue">Continue</button>
  `);

  screen.querySelector(".back-button").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });

  const wrap = screen.querySelector("#bodySvgWrap");

  screen.querySelectorAll(".body-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      screen.querySelectorAll(".body-toggle-btn").forEach(b => b.classList.remove("body-toggle-btn--active"));
      btn.classList.add("body-toggle-btn--active");
      wrap.innerHTML = makeSVG(btn.dataset.view === "front");
      applyZoom(); sel.clear(); cidx = 0; bindZones();
    });
  });

  let zi = 0;
  const zlbl = screen.querySelector("#zoomLabel");
  function getSVG() { return wrap.querySelector("svg"); }
  function applyZoom() {
    const s = getSVG(); if (s) s.setAttribute("viewBox", ZOOMS[zi]);
    zlbl.textContent = ZOOM_LABEL[zi];
  }
  screen.querySelector(".zoom-btn--minus").addEventListener("click", () => { if (zi > 0) { zi--; applyZoom(); } });
  screen.querySelector(".zoom-btn--plus").addEventListener("click",  () => { if (zi < ZOOMS.length - 1) { zi++; applyZoom(); } });

  const sel = new Map();
  let cidx = 0;

  function bindZones() {
    wrap.querySelectorAll(".z").forEach(z => {
      z.addEventListener("click", e => {
        e.stopPropagation();
        const n = z.dataset.zone;
        if (sel.has(n)) { sel.delete(n); } else { sel.set(n, cidx++ % FILLS.length); }
        redraw();
      });
    });
  }

  function redraw() {
    wrap.querySelectorAll(".z").forEach(z => {
      const ci = sel.get(z.dataset.zone);
      z.style.fill = ci !== undefined ? FILLS[ci] : "";
    });
    wrap.querySelectorAll(".badge").forEach(b => b.remove());
    const s = getSVG(); if (!s) return;
    sel.forEach((ci, name) => {
      const z = wrap.querySelector(`[data-zone="${name}"]`); if (!z) return;
      const bb = z.getBBox();
      const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
      const lbl = LABELS[name] || name;
      const pw = lbl.length * 4.8 + 14;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "badge"); g.setAttribute("data-zone", name); g.style.cursor = "pointer";
      g.innerHTML = `<rect x="${cx-pw/2}" y="${cy-8}" width="${pw}" height="16" rx="8"
        fill="${BADGES[ci]}" stroke="#fff" stroke-width="1.2" opacity=".95"/>
        <text x="${cx}" y="${cy+4.5}" text-anchor="middle" font-size="7.5" font-weight="700"
        fill="#fff" font-family="Nunito,sans-serif">${lbl}</text>`;
      g.addEventListener("click", e => { e.stopPropagation(); sel.delete(name); redraw(); });
      s.appendChild(g);
    });
  }

  bindZones();

  screen.querySelector(".show-pain-continue").addEventListener("click", () => {
    window.location.hash = "#pain-type";
  });

  app.append(screen);
}