import { createStatusBar } from "../components/statusBar";
import { ASSETS } from "../assets";

function svgAfterFood() {
  return `<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
    <style>
      @keyframes af-steam1{0%,100%{transform:translateY(0);opacity:0}20%{opacity:0.9}80%{opacity:0.3;transform:translateY(-16px)}}
      @keyframes af-steam2{0%,100%{transform:translateY(0);opacity:0}20%{opacity:0.9}80%{opacity:0.3;transform:translateY(-16px)}}
      .af-s1{animation:af-steam1 1.8s ease-out infinite 0s;transform-origin:40px 18px}
      .af-s2{animation:af-steam2 1.8s ease-out infinite 0.6s;transform-origin:55px 14px}
      .af-s3{animation:af-steam1 1.8s ease-out infinite 1.1s;transform-origin:70px 18px}
    </style>
    <ellipse cx="55" cy="66" rx="42" ry="8" fill="#FFD870" opacity="0.5"/>
    <ellipse cx="55" cy="62" rx="40" ry="7" fill="#FFE98A"/>
    <path d="M18 44 Q18 68 55 68 Q92 68 92 44 Z" fill="#FF9C3A"/>
    <path d="M18 44 Q18 50 55 50 Q92 50 92 44 Z" fill="#FFB84D"/>
    <ellipse cx="42" cy="46" rx="10" ry="5" fill="#FFF0C0"/>
    <ellipse cx="57" cy="44" rx="8" ry="4" fill="#FFF0C0"/>
    <ellipse cx="71" cy="46" rx="9" ry="4" fill="#FFF0C0"/>
    <path d="M14 44 Q14 37 55 37 Q96 37 96 44" stroke="#E07000" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path class="af-s1" d="M40 18 Q36 13 40 8 Q44 3 40 0" stroke="#7098E0" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path class="af-s2" d="M55 14 Q51 9 55 4 Q59 -1 55 -4" stroke="#7098E0" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path class="af-s3" d="M70 18 Q66 13 70 8 Q74 3 70 0" stroke="#7098E0" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
    <rect x="87" y="24" width="4" height="26" rx="2" fill="#CC6600" transform="rotate(20,89,37)"/>
    <ellipse cx="93" cy="24" rx="5.5" ry="4" fill="#CC6600" transform="rotate(20,89,37)"/>
  </svg>`;
}

function svgAfterPlay() {
  return `<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
    <style>
      @keyframes ap-run{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
      @keyframes ap-leg1{0%,100%{transform:rotate(0deg)}50%{transform:rotate(28deg)}}
      @keyframes ap-leg2{0%,100%{transform:rotate(28deg)}50%{transform:rotate(0deg)}}
      @keyframes ap-arm1{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}}
      @keyframes ap-arm2{0%,100%{transform:rotate(20deg)}50%{transform:rotate(-20deg)}}
      @keyframes ap-ball{0%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}}
      .ap-body{animation:ap-run 0.5s ease-in-out infinite}
      .ap-l1{animation:ap-leg1 0.5s ease-in-out infinite;transform-origin:48px 54px}
      .ap-l2{animation:ap-leg2 0.5s ease-in-out infinite;transform-origin:55px 54px}
      .ap-a1{animation:ap-arm1 0.5s ease-in-out infinite;transform-origin:43px 40px}
      .ap-a2{animation:ap-arm2 0.5s ease-in-out infinite;transform-origin:59px 40px}
      .ap-ball{animation:ap-ball 0.5s ease-in-out infinite}
    </style>
    <ellipse cx="55" cy="74" rx="40" ry="4" fill="#A8D7FF" opacity="0.4"/>
    <g class="ap-ball">
      <circle cx="87" cy="54" r="11" fill="#FF6F61"/>
      <path d="M80 47 Q87 53 94 47" stroke="#CC3320" stroke-width="1.2" fill="none"/>
      <path d="M78 54 Q87 60 96 54" stroke="#CC3320" stroke-width="1.2" fill="none"/>
      <path d="M80 61 Q87 55 94 61" stroke="#CC3320" stroke-width="1.2" fill="none"/>
    </g>
    <g class="ap-body">
      <circle cx="51" cy="20" r="10" fill="#FFD870" stroke="#CC8800" stroke-width="1.2"/>
      <circle cx="48" cy="19" r="1.8" fill="#3a2a18"/>
      <circle cx="54" cy="19" r="1.8" fill="#3a2a18"/>
      <path d="M48 25 Q51 28 54 25" stroke="#CC8800" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <rect x="44" y="30" width="14" height="20" rx="5" fill="#4FB4A6"/>
      <rect class="ap-a1" x="31" y="30" width="13" height="4" rx="2" fill="#FFD870"/>
      <rect class="ap-a2" x="57" y="30" width="13" height="4" rx="2" fill="#FFD870"/>
      <rect class="ap-l1" x="45" y="48" width="6" height="20" rx="3" fill="#FFD870"/>
      <rect class="ap-l2" x="51" y="48" width="6" height="20" rx="3" fill="#FFD870"/>
    </g>
  </svg>`;
}

function svgIDontKnow() {
  return `<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
    <style>
      @keyframes dk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes dk-q{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.25;transform:scale(0.75)}}
      @keyframes dk-q2{0%,100%{opacity:0.25;transform:scale(0.75)}50%{opacity:1;transform:scale(1)}}
      @keyframes dk-shrug1{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-18deg)}}
      @keyframes dk-shrug2{0%,100%{transform:rotate(0deg)}50%{transform:rotate(18deg)}}
      .dk-fig{animation:dk-bob 2s ease-in-out infinite}
      .dk-q1{animation:dk-q 1.4s ease-in-out infinite;transform-origin:80px 16px}
      .dk-q2{animation:dk-q2 1.4s ease-in-out infinite;transform-origin:92px 28px}
      .dk-arm1{animation:dk-shrug1 2s ease-in-out infinite;transform-origin:38px 46px}
      .dk-arm2{animation:dk-shrug2 2s ease-in-out infinite;transform-origin:68px 46px}
    </style>
    <g class="dk-fig">
      <circle cx="55" cy="22" r="16" fill="#FFD870" stroke="#CC8800" stroke-width="1.2"/>
      <path d="M48 19 Q50 17 52 19" stroke="#3a2a18" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M58 19 Q60 17 62 19" stroke="#3a2a18" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M49 28 Q52 25 55 28 Q58 31 61 28" stroke="#CC8800" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <rect x="44" y="38" width="22" height="24" rx="7" fill="#8CC8FF"/>
      <rect class="dk-arm1" x="24" y="40" width="20" height="5" rx="2.5" fill="#FFD870"/>
      <rect class="dk-arm2" x="66" y="40" width="20" height="5" rx="2.5" fill="#FFD870"/>
      <rect x="46" y="60" width="7" height="16" rx="3.5" fill="#FFD870"/>
      <rect x="57" y="60" width="7" height="16" rx="3.5" fill="#FFD870"/>
    </g>
    <text class="dk-q1" x="76" y="22" font-family="Nunito,sans-serif" font-weight="700" font-size="20" fill="#FF6F61">?</text>
    <text class="dk-q2" x="87" y="34" font-family="Nunito,sans-serif" font-weight="700" font-size="14" fill="#FF6F61" opacity="0.7">?</text>
  </svg>`;
}

function svgAfterSleep() {
  return `<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
    <style>
      @keyframes sl-zzz{0%,100%{opacity:0;transform:translate(0,0) scale(0.5)}20%{opacity:1;transform:translate(0,0) scale(1)}80%{opacity:0.2}100%{opacity:0;transform:translate(-8px,-18px) scale(1.2)}}
      @keyframes sl-breathe{0%,100%{transform:scaleX(1) scaleY(1)}50%{transform:scaleX(1.04) scaleY(0.97)}}
      @keyframes sl-moon{0%,100%{transform:rotate(0deg)}50%{transform:rotate(8deg)}}
      .sz1{animation:sl-zzz 2.4s ease-out infinite 0s;transform-origin:76px 22px}
      .sz2{animation:sl-zzz 2.4s ease-out infinite 0.8s;transform-origin:86px 14px}
      .sz3{animation:sl-zzz 2.4s ease-out infinite 1.6s;transform-origin:71px 12px}
      .sbr{animation:sl-breathe 3s ease-in-out infinite;transform-origin:55px 52px}
      .smoon{animation:sl-moon 4s ease-in-out infinite;transform-origin:90px 12px}
    </style>
    <rect x="10" y="46" width="90" height="26" rx="13" fill="#C8E8FF" stroke="#7098E0" stroke-width="1.2"/>
    <ellipse cx="55" cy="46" rx="32" ry="7" fill="#A8D7FF" opacity="0.6"/>
    <g class="sbr">
      <rect x="17" y="37" width="70" height="18" rx="9" fill="#FFE98A" stroke="#CC8800" stroke-width="1"/>
    </g>
    <circle cx="30" cy="44" r="15" fill="#FFD870" stroke="#CC8800" stroke-width="1.2"/>
    <path d="M24 42 Q27 39 30 42" stroke="#3a2a18" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M30 42 Q33 39 36 42" stroke="#3a2a18" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M25 49 Q30 53 35 49" stroke="#CC8800" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <g class="smoon">
      <path d="M90 4 Q98 8 96 18 Q91 22 84 18 Q92 15 90 7 Z" fill="#FFE98A" stroke="#CC8800" stroke-width="0.8"/>
    </g>
    <text class="sz1" x="72" y="28" font-family="Nunito,sans-serif" font-weight="700" font-size="15" fill="#7098E0">Z</text>
    <text class="sz2" x="81" y="18" font-family="Nunito,sans-serif" font-weight="700" font-size="12" fill="#7098E0" opacity="0.8">Z</text>
    <text class="sz3" x="68" y="14" font-family="Nunito,sans-serif" font-weight="700" font-size="9" fill="#7098E0" opacity="0.6">Z</text>
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