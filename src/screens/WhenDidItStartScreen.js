import { createStatusBar } from "../components/statusBar";
import { ASSETS } from "../assets";

function svgAfterFood() {
  return `<svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:100%;height:100%">
    <style>
      @keyframes af-steam1{0%,100%{transform:translateY(0);opacity:0}20%{opacity:0.9}80%{opacity:0.3;transform:translateY(-18px)}}
      @keyframes af-steam2{0%,100%{transform:translateY(0);opacity:0}20%{opacity:0.9}80%{opacity:0.3;transform:translateY(-18px)}}
      .af-s1{animation:af-steam1 1.8s ease-out infinite 0s;transform-origin:52px 22px}
      .af-s2{animation:af-steam2 1.8s ease-out infinite 0.6s;transform-origin:70px 18px}
      .af-s3{animation:af-steam1 1.8s ease-out infinite 1.1s;transform-origin:88px 22px}
    </style>
    <ellipse cx="70" cy="76" rx="52" ry="10" fill="#FFD870" opacity="0.5"/>
    <ellipse cx="70" cy="72" rx="50" ry="9" fill="#FFE98A"/>
    <path d="M26 52 Q26 80 70 80 Q114 80 114 52 Z" fill="#FF9C3A"/>
    <path d="M26 52 Q26 58 70 58 Q114 58 114 52 Z" fill="#FFB84D"/>
    <ellipse cx="55" cy="54" rx="12" ry="6" fill="#FFF0C0"/>
    <ellipse cx="72" cy="52" rx="10" ry="5" fill="#FFF0C0"/>
    <ellipse cx="88" cy="54" rx="11" ry="5" fill="#FFF0C0"/>
    <path d="M22 52 Q22 44 70 44 Q118 44 118 52" stroke="#E07000" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path class="af-s1" d="M52 22 Q48 16 52 10 Q56 4 52 0" stroke="#7098E0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path class="af-s2" d="M70 18 Q66 12 70 6 Q74 0 70 -4" stroke="#7098E0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path class="af-s3" d="M88 22 Q84 16 88 10 Q92 4 88 0" stroke="#7098E0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <rect x="108" y="28" width="5" height="32" rx="2.5" fill="#CC6600" transform="rotate(20,110,44)"/>
    <ellipse cx="116" cy="28" rx="7" ry="5" fill="#CC6600" transform="rotate(20,110,44)"/>
  </svg>`;
}

function svgAfterPlay() {
  return `<svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:100%;height:100%">
    <style>
      @keyframes ap-run{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}
      @keyframes ap-leg1{0%,100%{transform:rotate(0deg)}50%{transform:rotate(28deg)}}
      @keyframes ap-leg2{0%,100%{transform:rotate(28deg)}50%{transform:rotate(0deg)}}
      @keyframes ap-arm1{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}}
      @keyframes ap-arm2{0%,100%{transform:rotate(20deg)}50%{transform:rotate(-20deg)}}
      @keyframes ap-ball{0%,100%{transform:translateY(0)}40%{transform:translateY(-12px)}}
      .ap-body{animation:ap-run 0.5s ease-in-out infinite}
      .ap-l1{animation:ap-leg1 0.5s ease-in-out infinite;transform-origin:63px 58px}
      .ap-l2{animation:ap-leg2 0.5s ease-in-out infinite;transform-origin:70px 58px}
      .ap-a1{animation:ap-arm1 0.5s ease-in-out infinite;transform-origin:58px 42px}
      .ap-a2{animation:ap-arm2 0.5s ease-in-out infinite;transform-origin:74px 42px}
      .ap-ball{animation:ap-ball 0.5s ease-in-out infinite}
    </style>
    <ellipse cx="70" cy="84" rx="50" ry="5" fill="#A8D7FF" opacity="0.4"/>
    <g class="ap-ball">
      <circle cx="108" cy="62" r="13" fill="#FF6F61"/>
      <path d="M100 54 Q108 60 116 54" stroke="#CC3320" stroke-width="1.5" fill="none"/>
      <path d="M97 62 Q108 68 119 62" stroke="#CC3320" stroke-width="1.5" fill="none"/>
      <path d="M100 70 Q108 64 116 70" stroke="#CC3320" stroke-width="1.5" fill="none"/>
    </g>
    <g class="ap-body">
      <circle cx="70" cy="24" r="12" fill="#FFD870" stroke="#CC8800" stroke-width="1.5"/>
      <circle cx="66" cy="22" r="2" fill="#3a2a18"/>
      <circle cx="74" cy="22" r="2" fill="#3a2a18"/>
      <path d="M66 28 Q70 32 74 28" stroke="#CC8800" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <rect x="62" y="36" width="16" height="22" rx="6" fill="#4FB4A6"/>
      <rect class="ap-a1" x="46" y="36" width="16" height="5" rx="2.5" fill="#FFD870"/>
      <rect class="ap-a2" x="76" y="36" width="16" height="5" rx="2.5" fill="#FFD870"/>
      <rect class="ap-l1" x="63" y="56" width="7" height="22" rx="3.5" fill="#FFD870"/>
      <rect class="ap-l2" x="70" y="56" width="7" height="22" rx="3.5" fill="#FFD870"/>
    </g>
  </svg>`;
}

function svgIDontKnow() {
  return `<svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:100%;height:100%">
    <style>
      @keyframes dk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes dk-q{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.8)}}
      @keyframes dk-q2{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
      @keyframes dk-shrug1{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-18deg)}}
      @keyframes dk-shrug2{0%,100%{transform:rotate(0deg)}50%{transform:rotate(18deg)}}
      .dk-fig{animation:dk-bob 2s ease-in-out infinite}
      .dk-q1{animation:dk-q 1.4s ease-in-out infinite;transform-origin:100px 20px}
      .dk-q2{animation:dk-q2 1.4s ease-in-out infinite;transform-origin:116px 32px}
      .dk-arm1{animation:dk-shrug1 2s ease-in-out infinite;transform-origin:54px 50px}
      .dk-arm2{animation:dk-shrug2 2s ease-in-out infinite;transform-origin:86px 50px}
    </style>
    <g class="dk-fig">
      <circle cx="70" cy="26" r="18" fill="#FFD870" stroke="#CC8800" stroke-width="1.5"/>
      <path d="M62 22 Q64 19 66 22" stroke="#3a2a18" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M74 22 Q76 19 78 22" stroke="#3a2a18" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M63 32 Q67 29 70 32 Q73 35 77 32" stroke="#CC8800" stroke-width="2" fill="none" stroke-linecap="round"/>
      <rect x="58" y="44" width="24" height="26" rx="8" fill="#8CC8FF"/>
      <rect class="dk-arm1" x="36" y="46" width="22" height="6" rx="3" fill="#FFD870"/>
      <rect class="dk-arm2" x="82" y="46" width="22" height="6" rx="3" fill="#FFD870"/>
      <rect x="60" y="68" width="8" height="18" rx="4" fill="#FFD870"/>
      <rect x="72" y="68" width="8" height="18" rx="4" fill="#FFD870"/>
    </g>
    <text class="dk-q1" x="96" y="26" font-family="Nunito,sans-serif" font-weight="700" font-size="22" fill="#FF6F61">?</text>
    <text class="dk-q2" x="110" y="40" font-family="Nunito,sans-serif" font-weight="700" font-size="16" fill="#FF6F61" opacity="0.7">?</text>
  </svg>`;
}

function svgAfterSleep() {
  return `<svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:100%;height:100%">
    <style>
      @keyframes sl-zzz{0%,100%{opacity:0;transform:translate(0,0) scale(0.5)}20%{opacity:1;transform:translate(0,0) scale(1)}80%{opacity:0.2}100%{opacity:0;transform:translate(-10px,-20px) scale(1.3)}}
      @keyframes sl-breathe{0%,100%{transform:scaleX(1) scaleY(1)}50%{transform:scaleX(1.04) scaleY(0.97)}}
      @keyframes sl-moon{0%,100%{transform:rotate(0deg)}50%{transform:rotate(8deg)}}
      .sz1{animation:sl-zzz 2.4s ease-out infinite 0s;transform-origin:96px 28px}
      .sz2{animation:sl-zzz 2.4s ease-out infinite 0.8s;transform-origin:108px 18px}
      .sz3{animation:sl-zzz 2.4s ease-out infinite 1.6s;transform-origin:90px 16px}
      .sbr{animation:sl-breathe 3s ease-in-out infinite;transform-origin:70px 60px}
      .smoon{animation:sl-moon 4s ease-in-out infinite;transform-origin:114px 16px}
    </style>
    <rect x="14" y="54" width="112" height="30" rx="15" fill="#C8E8FF" stroke="#7098E0" stroke-width="1.5"/>
    <ellipse cx="70" cy="54" rx="40" ry="8" fill="#A8D7FF" opacity="0.6"/>
    <g class="sbr">
      <rect x="22" y="44" width="86" height="22" rx="11" fill="#FFE98A" stroke="#CC8800" stroke-width="1.2"/>
    </g>
    <circle cx="38" cy="52" r="18" fill="#FFD870" stroke="#CC8800" stroke-width="1.5"/>
    <path d="M30 50 Q34 47 38 50" stroke="#3a2a18" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M38 50 Q42 47 46 50" stroke="#3a2a18" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M33 57 Q38 61 43 57" stroke="#CC8800" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <g class="smoon">
      <path d="M114 6 Q124 10 122 22 Q116 28 108 24 Q118 20 116 10 Z" fill="#FFE98A" stroke="#CC8800" stroke-width="1"/>
    </g>
    <text class="sz1" x="90" y="34" font-family="Nunito,sans-serif" font-weight="700" font-size="18" fill="#7098E0">Z</text>
    <text class="sz2" x="102" y="22" font-family="Nunito,sans-serif" font-weight="700" font-size="14" fill="#7098E0" opacity="0.8">Z</text>
    <text class="sz3" x="88" y="18" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#7098E0" opacity="0.6">Z</text>
  </svg>`;
}

const WHEN_TYPES = [
  { id: "after-food",  label: "After Food",   svg: svgAfterFood  },
  { id: "after-play",  label: "After Play",   svg: svgAfterPlay  },
  { id: "dont-know",   label: "I don't know", svg: svgIDontKnow  },
  { id: "after-sleep", label: "After Sleep",  svg: svgAfterSleep },
];

export function renderWhenDidItStartScreen(app, { painDesc = "", fromScreen = "#pain-type" } = {}) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen when-screen";
  screen.append(createStatusBar());

  const subtitle = painDesc ? `<p class="when-subtitle">(${painDesc})</p>` : "";

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar when-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>

    <div class="when-heading-wrap">
      <h1 class="when-title">When did it start?</h1>
      ${subtitle}
    </div>

    <div class="when-grid" role="group" aria-label="When did the pain start">
      ${WHEN_TYPES.map(w => `
        <button type="button" class="when-card" data-id="${w.id}" aria-label="${w.label}" aria-pressed="false">
          <div class="when-card-illustration">${w.svg()}</div>
          <div class="when-card-underline"></div>
          <span class="when-card-label">${w.label}</span>
        </button>
      `).join("")}
    </div>

    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn" disabled>Next</button>
    </div>
  `);

  const nextBtn = screen.querySelector(".pain-type-next-btn");

  screen.querySelectorAll(".when-card").forEach(card => {
    card.addEventListener("click", () => {
      screen.querySelectorAll(".when-card").forEach(c => {
        c.classList.remove("when-card--selected");
        c.setAttribute("aria-pressed", "false");
      });
      card.classList.add("when-card--selected");
      card.setAttribute("aria-pressed", "true");
      nextBtn.disabled = false;
    });
  });

  screen.querySelector(".back-button").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });
  screen.querySelector(".pain-type-back-btn").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });
  nextBtn.addEventListener("click", () => {
    window.location.hash = "#pain-scale";
  });

  app.append(screen);
}