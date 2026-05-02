import { ASSETS } from "../assets";

const PAIN_TYPES = [
  {
    id: "sharp",
    ariaLabel: "Sharp stabbing pain",
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
      <style>
        @keyframes s-jab{0%,55%,100%{transform:translateY(0)}20%{transform:translateY(-16px)}38%{transform:translateY(18px)}}
        @keyframes s-burst{0%,35%,100%{opacity:0;transform:scale(0.2)}50%,68%{opacity:1;transform:scale(1)}}
        @keyframes s-glow{0%,35%,100%{opacity:0}50%,68%{opacity:0.35}}
        .sn{animation:s-jab 1.4s cubic-bezier(.36,.07,.19,.97) infinite;transform-origin:40px 40px}
        .sb{animation:s-burst 1.4s cubic-bezier(.36,.07,.19,.97) infinite;transform-origin:40px 62px}
        .sg{animation:s-glow 1.4s cubic-bezier(.36,.07,.19,.97) infinite;transform-origin:40px 62px}
      </style>
      <circle class="sg" cx="40" cy="62" r="18" fill="#FF6F61"/>
      <g class="sn">
        <rect x="37" y="6" width="6" height="48" rx="3" fill="#FF6F61"/>
        <polygon points="40,62 34,50 46,50" fill="#CC3320"/>
        <rect x="31" y="4" width="18" height="9" rx="4.5" fill="#CC3320"/>
      </g>
      <g class="sb">
        <line x1="40" y1="62" x2="18" y2="52" stroke="#FF6F61" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="40" y1="62" x2="62" y2="52" stroke="#FF6F61" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="40" y1="62" x2="16" y2="67" stroke="#FF6F61" stroke-width="2"   stroke-linecap="round"/>
        <line x1="40" y1="62" x2="64" y2="67" stroke="#FF6F61" stroke-width="2"   stroke-linecap="round"/>
        <line x1="40" y1="62" x2="26" y2="76" stroke="#FF6F61" stroke-width="2"   stroke-linecap="round"/>
        <line x1="40" y1="62" x2="54" y2="76" stroke="#FF6F61" stroke-width="2"   stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: "burning",
    ariaLabel: "Burning pain",
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
      <style>
        @keyframes b-sway{0%,100%{transform:rotate(0deg) scaleX(1)}20%{transform:rotate(-7deg) scaleX(0.88)}60%{transform:rotate(6deg) scaleX(1.1)}}
        @keyframes b-inner{0%,100%{transform:scaleX(1) scaleY(1)}25%{transform:scaleX(0.78) scaleY(0.9)}70%{transform:scaleX(1.14) scaleY(1.07)}}
        @keyframes b-ember{0%,100%{opacity:0;transform:translateY(0) scale(0)}30%{opacity:0.9;transform:translateY(-8px) scale(1)}70%{opacity:0.4;transform:translateY(-20px) scale(0.6)}}
        @keyframes b-ember2{0%,100%{opacity:0;transform:translateY(0) scale(0)}40%{opacity:0.9;transform:translateY(-10px) scale(1)}80%{opacity:0;transform:translateY(-22px) scale(0.4)}}
        .bf{transform-origin:40px 72px;animation:b-sway 0.85s ease-in-out infinite}
        .bi{transform-origin:40px 72px;animation:b-inner 0.68s ease-in-out infinite 0.08s}
        .be1{animation:b-ember 1.2s ease-out infinite 0s;transform-origin:34px 30px}
        .be2{animation:b-ember2 1.2s ease-out infinite 0.4s;transform-origin:46px 26px}
        .be3{animation:b-ember 1.2s ease-out infinite 0.7s;transform-origin:38px 22px}
      </style>
      <g class="bf">
        <path d="M40 8 C40 8 57 26 57 43 C57 57 51 70 40 74 C29 70 23 57 23 43 C23 31 31 19 33 13 C34 21 37 30 40 36 C40 26 39 14 40 8Z" fill="#FF9C3A" stroke="#E07000" stroke-width="1"/>
      </g>
      <g class="bi">
        <path d="M40 33 C40 33 48 40 48 48 C48 56 44 62 40 64 C36 62 32 56 32 48 C32 40 40 33 40 33Z" fill="#FFE040"/>
      </g>
      <circle cx="40" cy="53" r="4.5" fill="#fff" opacity="0.5"/>
      <circle class="be1" cx="34" cy="30" r="2.5" fill="#FF6F61"/>
      <circle class="be2" cx="46" cy="26" r="2"   fill="#FFB030"/>
      <circle class="be3" cx="38" cy="22" r="1.8" fill="#FF6F61"/>
    </svg>`,
  },
  {
    id: "throbbing",
    ariaLabel: "Throbbing pulsing pain",
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
      <style>
        @keyframes th-r{0%{r:6;opacity:1;stroke-width:3.5}100%{r:36;opacity:0;stroke-width:0.5}}
        @keyframes th-beat{0%,100%{transform:scale(1)}35%{transform:scale(1.45)}55%{transform:scale(0.9)}}
        @keyframes th-line{0%,100%{opacity:0.2}35%{opacity:1}}
        .tr1{animation:th-r 1.3s ease-out infinite;transform-origin:40px 40px}
        .tr2{animation:th-r 1.3s ease-out infinite 0.65s;transform-origin:40px 40px}
        .td{animation:th-beat 1.3s cubic-bezier(.25,.46,.45,.94) infinite;transform-origin:40px 40px}
        .tl{animation:th-line 1.3s ease-in-out infinite}
      </style>
      <circle class="tr1" cx="40" cy="40" r="6"  fill="none" stroke="#C050D0" stroke-width="3.5"/>
      <circle class="tr2" cx="40" cy="40" r="6"  fill="none" stroke="#C050D0" stroke-width="3.5"/>
      <polyline class="tl" points="6,40 16,40 20,24 25,56 30,34 35,46 40,40 74,40" stroke="#C050D0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle class="td" cx="40" cy="40" r="10" fill="#C050D0"/>
    </svg>`,
  },
  {
    id: "pressure",
    ariaLabel: "Pressing heavy pain",
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
      <style>
        @keyframes pr-dn{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}
        @keyframes pr-sh{0%,100%{opacity:0.18}50%{opacity:0.5}}
        @keyframes pr-sq{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.7)}}
        .pw{animation:pr-dn 2s ease-in-out infinite;transform-origin:40px 35px}
        .psh{animation:pr-sh 2s ease-in-out infinite;transform-origin:40px 70px}
        .psq{animation:pr-sq 2s ease-in-out infinite;transform-origin:40px 70px}
      </style>
      <g class="pw">
        <rect x="31" y="4"  width="18" height="8"  rx="4"  fill="#5070C0"/>
        <rect x="23" y="12" width="34" height="14" rx="6"  fill="#7098E0"/>
        <rect x="16" y="26" width="48" height="22" rx="9"  fill="#7098E0"/>
        <line x1="28" y1="33" x2="28" y2="42" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
        <line x1="40" y1="33" x2="40" y2="42" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
        <line x1="52" y1="33" x2="52" y2="42" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
      </g>
      <ellipse class="psh" cx="40" cy="70" rx="20" ry="5" fill="#7098E0"/>
      <ellipse class="psq" cx="40" cy="70" rx="20" ry="5" fill="#7098E0" opacity="0.3"/>
    </svg>`,
  },
  {
    id: "aching",
    ariaLabel: "Dull aching pain",
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
      <style>
        @keyframes ac-p{0%{transform:scale(0.15);opacity:0.9}100%{transform:scale(1);opacity:0}}
        @keyframes ac-dot{0%,100%{opacity:0.6}50%{opacity:1}}
        .ar1{animation:ac-p 3.2s ease-out infinite 0s;transform-origin:40px 40px}
        .ar2{animation:ac-p 3.2s ease-out infinite 1.07s;transform-origin:40px 40px}
        .ar3{animation:ac-p 3.2s ease-out infinite 2.13s;transform-origin:40px 40px}
        .adot{animation:ac-dot 3.2s ease-in-out infinite}
      </style>
      <circle class="ar1" cx="40" cy="40" r="34" fill="none" stroke="#7098E0" stroke-width="3.5"/>
      <circle class="ar2" cx="40" cy="40" r="34" fill="none" stroke="#7098E0" stroke-width="3.5"/>
      <circle class="ar3" cx="40" cy="40" r="34" fill="none" stroke="#7098E0" stroke-width="3.5"/>
      <circle class="adot" cx="40" cy="40" r="7" fill="#7098E0"/>
    </svg>`,
  },
  {
    id: "tingling",
    ariaLabel: "Tingling pins and needles",
    icon: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
      <style>
        @keyframes zp{0%,100%{opacity:0;transform:translateY(0) scale(0.3)}18%,38%{opacity:1;transform:translateY(0) scale(1)}60%,99%{opacity:0;transform:translateY(-8px) scale(0.5)}}
        .z1{animation:zp 1.8s ease-out infinite 0s;transform-origin:40px 12px}
        .z2{animation:zp 1.8s ease-out infinite 0.3s;transform-origin:66px 28px}
        .z3{animation:zp 1.8s ease-out infinite 0.6s;transform-origin:66px 54px}
        .z4{animation:zp 1.8s ease-out infinite 0.9s;transform-origin:40px 70px}
        .z5{animation:zp 1.8s ease-out infinite 1.2s;transform-origin:14px 54px}
        .z6{animation:zp 1.8s ease-out infinite 1.5s;transform-origin:14px 28px}
      </style>
      <g class="z1">
        <line x1="40" y1="6"  x2="40" y2="18" stroke="#50C890" stroke-width="3" stroke-linecap="round"/>
        <circle cx="40" cy="22" r="3.5" fill="#50C890"/>
      </g>
      <g class="z2">
        <line x1="66" y1="22" x2="66" y2="34" stroke="#50C890" stroke-width="3" stroke-linecap="round"/>
        <circle cx="66" cy="38" r="3.5" fill="#50C890"/>
      </g>
      <g class="z3">
        <line x1="66" y1="48" x2="66" y2="60" stroke="#50C890" stroke-width="3" stroke-linecap="round"/>
        <circle cx="66" cy="64" r="3.5" fill="#50C890"/>
      </g>
      <g class="z4">
        <line x1="40" y1="62" x2="40" y2="74" stroke="#50C890" stroke-width="3" stroke-linecap="round"/>
        <circle cx="40" cy="58" r="3.5" fill="#50C890"/>
      </g>
      <g class="z5">
        <line x1="14" y1="48" x2="14" y2="60" stroke="#50C890" stroke-width="3" stroke-linecap="round"/>
        <circle cx="14" cy="64" r="3.5" fill="#50C890"/>
      </g>
      <g class="z6">
        <line x1="14" y1="22" x2="14" y2="34" stroke="#50C890" stroke-width="3" stroke-linecap="round"/>
        <circle cx="14" cy="38" r="3.5" fill="#50C890"/>
      </g>
      <circle cx="40" cy="40" r="5" fill="#50C890" opacity="0.45"/>
    </svg>`,
  },
];

export function renderPainTypeScreen(app, { bodyPart = "", fromScreen = "#body-map" } = {}) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen pain-type-screen";

  const subtitle = bodyPart ? `<p class="pain-type-subtitle">(${bodyPart})</p>` : "";

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar pain-type-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>

    <div class="pain-type-heading-wrap">
      <h1 class="pain-type-title">What kind of pain is it?</h1>
      ${subtitle}
    </div>

    <div class="pain-type-grid" role="group" aria-label="Pain types">
      ${PAIN_TYPES.map(p => `
        <button type="button" class="pain-card" data-id="${p.id}" aria-label="${p.ariaLabel}" aria-pressed="false">
          <div class="pain-card-icon">${p.icon}</div>
        </button>
      `).join("")}
    </div>

    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn" disabled>Next</button>
    </div>
  `);

  const nextBtn = screen.querySelector(".pain-type-next-btn");

  screen.querySelectorAll(".pain-card").forEach(card => {
    card.addEventListener("click", () => {
      screen.querySelectorAll(".pain-card").forEach(c => {
        c.classList.remove("pain-card--selected");
        c.setAttribute("aria-pressed", "false");
      });
      card.classList.add("pain-card--selected");
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
    window.location.hash = "#when-did-it-start";
  });

  app.append(screen);
}