(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(s){if(s.ep)return;s.ep=!0;const n=i(s);fetch(s.href,n)}})();const o={roleIcons:"https://www.figma.com/api/mcp/asset/15ed1bbb-d6e6-4f78-b490-d31cc0fb9e9d",backChevron:"https://www.figma.com/api/mcp/asset/b4f47c29-dc40-44fa-b5d0-53fcac5a3b14",teddyBackground:"https://www.figma.com/api/mcp/asset/21892e67-8fdd-4e2e-9215-a772b96c1957",logoMark:"https://www.figma.com/api/mcp/asset/a403decb-d6f9-4de4-b731-3d8afa7d3a75",logoText:"https://www.figma.com/api/mcp/asset/dc52178e-2c15-4457-b562-f893358cc7a6",splashHeaderLogo:"https://www.figma.com/api/mcp/asset/75295db3-354b-4305-abe2-b36b40a98d22",splashMenuIcon:"https://www.figma.com/api/mcp/asset/d67d5e08-c6a6-4362-bd4b-775278fec520",splashAddButton:"https://www.figma.com/api/mcp/asset/d7fde74e-a6c6-411d-9189-ccf7866ec0a7",navClock:"https://www.figma.com/api/mcp/asset/bd98fb08-83e5-4773-a7a5-f7a8dbf4bb0d",statusNotch:"https://www.figma.com/api/mcp/asset/d703ca5f-a4af-46c2-9c22-7125d03d5b8a",statusRightSide:"https://www.figma.com/api/mcp/asset/b9af71e6-2987-4e45-91a1-8bcd79ecacc2",overlayCircle:"https://www.figma.com/api/mcp/asset/a281a1af-8d1b-47f9-91e6-8613899d350c",overlayPlus:"https://www.figma.com/api/mcp/asset/646ae797-850f-45ca-82d3-79d428c7de88",childPhoto:"https://www.figma.com/api/mcp/asset/16fd1ddf-bf78-495c-a31d-f53cfbe2e5f0",secondChildPhoto:"https://www.figma.com/api/mcp/asset/23dc3de7-1867-4617-815b-ec4090c78057",floatingAddButton:"https://www.figma.com/api/mcp/asset/524f45b9-3748-49d7-9ee2-0f542f9c0c2f",floatingAddButtonAlt:"https://www.figma.com/api/mcp/asset/008b694e-dc4b-4181-85fd-ac2a014438c3"};function T(a){a.innerHTML="";const t=document.createElement("main");t.className="screen get-started-screen",t.insertAdjacentHTML("beforeend",`
    <img class="bg-teddy bg-teddy--top" src="${o.teddyBackground}" alt="" aria-hidden="true" />
    <img class="bg-teddy bg-teddy--bottom" src="${o.teddyBackground}" alt="" aria-hidden="true" />
    <h1 class="welcome-title">Welcome to</h1>
    <section class="app-thumbnail" aria-label="Nana app logo card">
      <img src="${o.logoMark}" alt="" class="thumbnail-mark" />
      <img src="${o.logoText}" alt="Nana the app" class="thumbnail-text" />
    </section>
    <button type="button" class="continue-button get-started-button">Get Started</button>
    <p class="tagline">“a visual voice for when it hurts”</p>
  `),t.querySelector(".get-started-button")?.addEventListener("click",()=>{window.location.hash="#select-role"}),a.append(t)}function y(){const a=document.createElement("div");return a.className="status-bar",a.setAttribute("aria-hidden","true"),a.innerHTML=`
    <img class="status-notch" src="${o.statusNotch}" alt="" />
    <div class="status-time">9:41</div>
    <img class="status-right" src="${o.statusRightSide}" alt="" />
  `,a}function H(a){a.innerHTML="";const t=document.createElement("main");t.className="screen select-role-screen",t.append(y()),t.insertAdjacentHTML("beforeend",`
    <header class="top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${o.backChevron}" alt="" />
      </button>
    </header>
    <h1 class="screen-title">Who are you?</h1>

    <section class="role-options">

      <article class="role-option" data-role="parent">
        <div class="role-icon role-icon--parent">
          <img src="${o.roleIcons}" alt="Parent illustration" class="role-icon-image" />
        </div>
        <button class="role-button" type="button" data-role="parent">
          Parent / Caregiver
        </button>
      </article>

      <article class="role-option" data-role="doctor">
        <div class="role-icon role-icon--doctor">
          <img src="${o.roleIcons}" alt="Doctor illustration" class="role-icon-image" />
        </div>
        <button class="role-button" type="button" data-role="doctor">
          Doctor / Professional
        </button>
      </article>

    </section>

    <button class="continue-button" type="button" disabled>Continue</button>
  `);let i=null;const e=t.querySelector(".continue-button");function s(n){i=n,t.querySelectorAll(".role-button").forEach(r=>{r.classList.toggle("role-button--selected",r.dataset.role===n)}),t.querySelectorAll(".role-option").forEach(r=>{r.classList.toggle("role-option--selected",r.dataset.role===n)}),e.disabled=!1}t.querySelectorAll(".role-option").forEach(n=>{n.addEventListener("click",()=>s(n.dataset.role))}),t.querySelector(".back-button").addEventListener("click",()=>{window.location.hash="#get-started"}),e.addEventListener("click",()=>{i&&(window.location.hash="#homepage-newuser")}),a.append(t)}function N(a){const t=document.createElement("li");t.className="age-wheel-spacer",a.append(t);for(let e=1;e<=18;e+=1){const s=document.createElement("li");s.className="age-wheel-item",s.textContent=String(e),s.dataset.age=String(e),a.append(s)}const i=document.createElement("li");i.className="age-wheel-spacer",a.append(i)}function C(a){const t=a.getBoundingClientRect(),i=t.top+t.height/2;let e=null,s=Number.POSITIVE_INFINITY;a.querySelectorAll(".age-wheel-item").forEach(n=>{const r=n.getBoundingClientRect(),l=r.top+r.height/2,d=Math.abs(l-i);n.classList.remove("is-selected"),d<s&&(s=d,e=n)}),e&&e.classList.add("is-selected")}function z(){const a=document.createElement("div");a.className="add-child-overlay",a.hidden=!0,a.innerHTML=`
    <div class="add-child-backdrop" data-close-overlay="true"></div>
    <section class="add-child-modal" aria-label="Add child">
      <div class="add-image-card">
        <div class="add-image-icon-wrap">
          <img class="add-image-circle" src="${o.overlayCircle}" alt="" />
          <img class="add-image-plus" src="${o.overlayPlus}" alt="" />
        </div>
        <button type="button" class="add-image-action">+ Add image from Gallery</button>
      </div>
      <label class="child-name-field">
        <input type="text" placeholder="Child's Name" />
      </label>
      <h3 class="age-title">Select Age</h3>
      <div class="age-wheel-shell">
        <div class="age-wheel-fade age-wheel-fade--top"></div>
        <ul class="age-wheel" aria-label="Age selection"></ul>
        <div class="age-wheel-fade age-wheel-fade--bottom"></div>
      </div>
      <button type="button" class="save-child-button" data-close-overlay="true">Save</button>
    </section>
  `;const t=a.querySelector(".age-wheel");if(!t)return a;N(t),setTimeout(()=>{t.scrollTop=62,C(t)},0);let i=null;return t.addEventListener("scroll",()=>{C(t),i&&clearTimeout(i),i=setTimeout(()=>{t.querySelector(".age-wheel-item.is-selected")?.scrollIntoView({block:"center",behavior:"smooth"})},80)}),a}function Q(a){a.innerHTML="";const t=document.createElement("main");t.className="screen children-screen",t.append(y()),t.insertAdjacentHTML("beforeend",`
    <header class="children-header">
      <img src="${o.splashHeaderLogo}" alt="Nana logo" class="children-header-logo" />
      <button type="button" aria-label="Open menu" class="children-menu-button">
        <img src="${o.splashMenuIcon}" alt="" />
      </button>
    </header>

    <section class="children-intro">
      <h1 class="children-title">Your Children</h1>
      <p class="children-subtitle">will be listed here</p>
    </section>

    <section class="children-add-section">
      <h2 class="children-add-title">Tap to add a Child</h2>
      <button type="button" class="children-add-button" aria-label="Add child">
        <img src="${o.splashAddButton}" alt="" />
      </button>
    </section>

    <nav class="bottom-nav" aria-label="Main navigation">
      <button type="button" class="bottom-nav-item bottom-nav-item--home bottom-nav-item--active" aria-label="Home">
        <span class="bottom-nav-sprite bottom-nav-sprite--home" aria-hidden="true"></span>
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--activity" aria-label="Activity">
        <img src="${o.navClock}" alt="" />
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings" aria-label="Settings">
        <span class="bottom-nav-sprite bottom-nav-sprite--settings" aria-hidden="true"></span>
      </button>
    </nav>
  `);const i=z();t.append(i),t.querySelector(".children-add-button")?.addEventListener("click",()=>{i.hidden=!1}),i.querySelectorAll("[data-close-overlay='true']").forEach(n=>{n.addEventListener("click",()=>{i.hidden=!0})}),i.querySelector(".save-child-button")?.addEventListener("click",()=>{window.location.hash="#child-added"}),a.append(t)}function Y(a){a.innerHTML="";const t=document.createElement("main");t.className="screen children-screen child-added-screen",t.append(y()),t.insertAdjacentHTML("beforeend",`
    <header class="children-header">
      <img src="${o.splashHeaderLogo}" alt="Nana logo" class="children-header-logo" />
      <button type="button" aria-label="Open menu" class="children-menu-button">
        <img src="${o.splashMenuIcon}" alt="" />
      </button>
    </header>

    <section class="child-added-intro">
      <h1 class="children-title children-title--small">Your Children</h1>
    </section>

    <section class="child-card-list">
      <article class="child-card">
        <div class="child-card-photo-wrap">
          <img src="${o.childPhoto}" alt="Sunny" class="child-card-photo" />
        </div>
        <div class="child-card-divider"></div>
        <div class="child-card-meta">
          <p class="child-name">Sunny</p>
          <p class="child-age">4 years Old</p>
        </div>
        <div class="child-card-divider"></div>
        <button type="button" class="child-open-map-btn">Open Body Map</button>
      </article>
    </section>

    <button type="button" class="floating-add-btn" aria-label="Add child">
      <img src="${o.floatingAddButton}" alt="" />
    </button>

    <nav class="bottom-nav" aria-label="Main navigation">
      <button type="button" class="bottom-nav-item bottom-nav-item--home bottom-nav-item--active" aria-label="Home">
        <span class="bottom-nav-sprite bottom-nav-sprite--home" aria-hidden="true"></span>
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--activity" aria-label="Activity">
        <img src="${o.navClock}" alt="" />
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings" aria-label="Settings">
        <span class="bottom-nav-sprite bottom-nav-sprite--settings" aria-hidden="true"></span>
      </button>
    </nav>
  `),t.querySelector(".child-open-map-btn")?.addEventListener("click",()=>{window.location.hash="#body-map"});const e=z();t.append(e),t.querySelector(".floating-add-btn")?.addEventListener("click",()=>{e.hidden=!1}),e.querySelectorAll("[data-close-overlay='true']").forEach(r=>{r.addEventListener("click",()=>{e.hidden=!0})}),e.querySelector(".save-child-button")?.addEventListener("click",()=>{window.location.hash="#second-child-added"}),a.append(t)}function S({name:a,ageText:t,photo:i}){return`
    <article class="child-card child-card--compact">
      <div class="child-card-photo-wrap">
        <img src="${i}" alt="${a}" class="child-card-photo" />
      </div>
      <div class="child-card-divider"></div>
      <div class="child-card-meta child-card-meta--compact">
        <p class="child-name">${a}</p>
        <p class="child-age">${t}</p>
      </div>
      <button type="button" class="child-open-map-btn child-open-map-btn--compact">Open Body Map</button>
    </article>
  `}function j(a){a.innerHTML="";const t=document.createElement("main");t.className="screen children-screen child-added-screen",t.append(y()),t.insertAdjacentHTML("beforeend",`
    <header class="children-header children-header--logo-only">
      <img src="${o.splashHeaderLogo}" alt="Nana logo" class="children-header-logo children-header-logo--large" />
    </header>

    <section class="child-added-intro">
      <h1 class="children-title children-title--small">Your Children</h1>
    </section>

    <section class="child-card-list child-card-list--two">
      ${S({name:"Sunny",ageText:"4 years Old",photo:o.childPhoto})}
      ${S({name:"Leny",ageText:"8 years Old",photo:o.secondChildPhoto})}
    </section>

    <button type="button" class="floating-add-btn floating-add-btn--lower" aria-label="Add child">
      <img src="${o.floatingAddButtonAlt}" alt="" />
    </button>

    <nav class="bottom-nav" aria-label="Main navigation">
      <button type="button" class="bottom-nav-item bottom-nav-item--home bottom-nav-item--active" aria-label="Home">
        <span class="bottom-nav-sprite bottom-nav-sprite--home" aria-hidden="true"></span>
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--activity" aria-label="Activity">
        <img src="${o.navClock}" alt="" />
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings" aria-label="Settings">
        <span class="bottom-nav-sprite bottom-nav-sprite--settings" aria-hidden="true"></span>
      </button>
    </nav>
  `),a.append(t)}const D={head:"Head","back-head":"Head (back)",neck:"Neck",chest:"Chest",abdomen:"Tummy","upper-back":"Upper Back","lower-back":"Lower Back",hips:"Hips",glutes:"Bottom","left-arm":"Left Arm","right-arm":"Right Arm","left-forearm":"L. Forearm","right-forearm":"R. Forearm","left-hand":"Left Hand","right-hand":"Right Hand","left-thigh":"L. Thigh","right-thigh":"R. Thigh","left-hamstring":"L. Hamstring","right-hamstring":"R. Hamstring","left-shin":"Left Shin","right-shin":"Right Shin","left-calf":"Left Calf","right-calf":"Right Calf","left-foot":"Left Foot","right-foot":"Right Foot","left-heel":"Left Heel","right-heel":"Right Heel"},L=["rgba(255,80,60,.42)","rgba(255,165,30,.42)","rgba(30,185,100,.42)","rgba(50,140,255,.42)","rgba(180,70,220,.42)"],I=["#d42810","#c87800","#18904a","#1870d0","#9020b8"];function E(a){const t=a?`
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
  `:`
    <!-- hair swirl on back -->
    <path fill="none" stroke="#c89050" stroke-width="2" stroke-linecap="round" opacity=".5"
      d="M94 18 Q100 12 106 18 Q112 26 100 28 Q91 26 94 18"/>
  `,i=a?`
    <line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="4 3" opacity=".4" x1="46" y1="108" x2="154" y2="108"/>
  `:`
    <!-- spine -->
    <line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="3 3" opacity=".4" x1="100" y1="72" x2="100" y2="138"/>
    <!-- shoulder blades — same ellipse, perfectly symmetric -->
    <ellipse fill="#FFD870" stroke="#48AFA2" stroke-width="1.2" cx="81" cy="98" rx="14" ry="18" opacity=".75"/>
    <ellipse fill="#FFD870" stroke="#48AFA2" stroke-width="1.2" cx="119" cy="98" rx="14" ry="18" opacity=".75"/>
    <!-- glute line -->
    <line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="3 3" opacity=".35" x1="100" y1="140" x2="100" y2="184"/>
  `,e=(r,l)=>`<${l} class="z" data-zone="${r}"`,s=`
    ${e("head","ellipse")} cx="100" cy="30" rx="32" ry="34"/>
    ${e("neck","rect")} x="91" y="62" width="18" height="14" rx="6"/>
    ${e("chest","rect")} x="42" y="70" width="116" height="40" rx="4"/>
    ${e("abdomen","rect")} x="42" y="108" width="116" height="34" rx="4"/>
    ${e("hips","rect")} x="40" y="140" width="120" height="46" rx="4"/>
    ${e("left-arm","rect")} x="20" y="72" width="24" height="68" rx="12"/>
    ${e("right-arm","rect")} x="156" y="72" width="24" height="68" rx="12"/>
    ${e("left-forearm","rect")} x="16" y="144" width="22" height="58" rx="11"/>
    ${e("right-forearm","rect")} x="162" y="144" width="22" height="58" rx="11"/>
    ${e("left-hand","ellipse")} cx="27" cy="216" rx="16" ry="14"/>
    ${e("right-hand","ellipse")} cx="173" cy="216" rx="16" ry="14"/>
    ${e("left-thigh","rect")} x="44" y="184" width="36" height="72" rx="4"/>
    ${e("right-thigh","rect")} x="120" y="184" width="36" height="72" rx="4"/>
    ${e("left-shin","rect")} x="44" y="258" width="36" height="72" rx="4"/>
    ${e("right-shin","rect")} x="120" y="258" width="36" height="72" rx="4"/>
    ${e("left-foot","ellipse")} cx="62" cy="344" rx="22" ry="12"/>
    ${e("right-foot","ellipse")} cx="138" cy="344" rx="22" ry="12"/>
  `,n=`
    ${e("back-head","ellipse")} cx="100" cy="30" rx="32" ry="34"/>
    ${e("neck","rect")} x="91" y="62" width="18" height="14" rx="6"/>
    ${e("upper-back","rect")} x="42" y="70" width="116" height="40" rx="4"/>
    ${e("lower-back","rect")} x="42" y="108" width="116" height="34" rx="4"/>
    ${e("glutes","rect")} x="40" y="140" width="120" height="46" rx="4"/>
    ${e("left-shoulder","rect")} x="20" y="72" width="24" height="68" rx="12"/>
    ${e("right-shoulder","rect")} x="156" y="72" width="24" height="68" rx="12"/>
    ${e("left-forearm","rect")} x="16" y="144" width="22" height="58" rx="11"/>
    ${e("right-forearm","rect")} x="162" y="144" width="22" height="58" rx="11"/>
    ${e("left-hand","ellipse")} cx="27" cy="216" rx="16" ry="14"/>
    ${e("right-hand","ellipse")} cx="173" cy="216" rx="16" ry="14"/>
    ${e("left-hamstring","rect")} x="44" y="184" width="36" height="72" rx="4"/>
    ${e("right-hamstring","rect")} x="120" y="184" width="36" height="72" rx="4"/>
    ${e("left-calf","rect")} x="44" y="258" width="36" height="72" rx="4"/>
    ${e("right-calf","rect")} x="120" y="258" width="36" height="72" rx="4"/>
    ${e("left-heel","ellipse")} cx="62" cy="344" rx="22" ry="12"/>
    ${e("right-heel","ellipse")} cx="138" cy="344" rx="22" ry="12"/>
  `;return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 360" style="width:100%;height:100%;display:block">
<defs><style>
.b{fill:#FFE8A0;stroke:#48AFA2;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.j{fill:#FFD870;stroke:#48AFA2;stroke-width:1.5}
.z{fill:transparent;cursor:pointer}.z:hover{fill:rgba(255,90,70,.2)}
</style></defs>

<!-- HEAD -->
<ellipse class="b" cx="100" cy="30" rx="28" ry="30"/>
<ellipse class="b" cx="72"  cy="30" rx="5"  ry="6.5"/>
<ellipse class="b" cx="128" cy="30" rx="5"  ry="6.5"/>
${t}

<!-- NECK -->
<rect class="b" x="92" y="58" width="16" height="16" rx="6"/>

<!-- TORSO: x=44 to x=156, perfectly centred -->
<rect class="b" x="44" y="70" width="112" height="72" rx="20"/>
${i}

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
${a?s:n}
</svg>`}const A=["0 0 200 360","15 20 170 306","35 60 130 234","50 100 100 180"],P=["100%","118%","154%","200%"];function R(a,{fromScreen:t="#child-added"}={}){a.innerHTML="";const i=document.createElement("main");i.className="screen show-pain-screen",i.append(y()),i.insertAdjacentHTML("beforeend",`
    <header class="top-bar show-pain-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${o.backChevron}" alt=""/>
      </button>
    </header>
    <h1 class="show-pain-title">Where does it hurt?</h1>
    <div class="body-toggle" role="group" aria-label="Body view">
      <button type="button" class="body-toggle-btn body-toggle-btn--active" data-view="front">Front</button>
      <button type="button" class="body-toggle-btn" data-view="back">Back</button>
    </div>
    <p class="body-hint">Tap the place that hurts</p>
    <div class="body-map-wrap">
      <div class="body-svg-wrap" id="bodySvgWrap">${E(!0)}</div>
    </div>
    <div class="zoom-row">
      <button type="button" class="zoom-btn zoom-btn--minus" aria-label="Zoom out">−</button>
      <span class="zoom-label" id="zoomLabel">100%</span>
      <button type="button" class="zoom-btn zoom-btn--plus" aria-label="Zoom in">+</button>
    </div>
    <button type="button" class="continue-button show-pain-continue">Continue</button>
  `),i.querySelector(".back-button").addEventListener("click",()=>{window.location.hash=t});const e=i.querySelector("#bodySvgWrap");i.querySelectorAll(".body-toggle-btn").forEach(c=>{c.addEventListener("click",()=>{i.querySelectorAll(".body-toggle-btn").forEach(p=>p.classList.remove("body-toggle-btn--active")),c.classList.add("body-toggle-btn--active"),e.innerHTML=E(c.dataset.view==="front"),l(),d.clear(),g=0,b()})});let s=0;const n=i.querySelector("#zoomLabel");function r(){return e.querySelector("svg")}function l(){const c=r();c&&c.setAttribute("viewBox",A[s]),n.textContent=P[s]}i.querySelector(".zoom-btn--minus").addEventListener("click",()=>{s>0&&(s--,l())}),i.querySelector(".zoom-btn--plus").addEventListener("click",()=>{s<A.length-1&&(s++,l())});const d=new Map;let g=0;function b(){e.querySelectorAll(".z").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation();const h=c.dataset.zone;d.has(h)?d.delete(h):d.set(h,g++%L.length),f()})})}function f(){e.querySelectorAll(".z").forEach(p=>{const h=d.get(p.dataset.zone);p.style.fill=h!==void 0?L[h]:""}),e.querySelectorAll(".badge").forEach(p=>p.remove());const c=r();c&&d.forEach((p,h)=>{const w=e.querySelector(`[data-zone="${h}"]`);if(!w)return;const x=w.getBBox(),v=x.x+x.width/2,k=x.y+x.height/2,F=D[h]||h,$=F.length*4.8+14,m=document.createElementNS("http://www.w3.org/2000/svg","g");m.setAttribute("class","badge"),m.setAttribute("data-zone",h),m.style.cursor="pointer",m.innerHTML=`<rect x="${v-$/2}" y="${k-8}" width="${$}" height="16" rx="8"
        fill="${I[p]}" stroke="#fff" stroke-width="1.2" opacity=".95"/>
        <text x="${v}" y="${k+4.5}" text-anchor="middle" font-size="7.5" font-weight="700"
        fill="#fff" font-family="Nunito,sans-serif">${F}</text>`,m.addEventListener("click",q=>{q.stopPropagation(),d.delete(h),f()}),c.appendChild(m)})}b(),i.querySelector(".show-pain-continue").addEventListener("click",()=>{window.location.hash="#pain-type"}),a.append(i)}const O=[{id:"sharp",ariaLabel:"Sharp stabbing pain",icon:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
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
    </svg>`},{id:"burning",ariaLabel:"Burning pain",icon:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
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
    </svg>`},{id:"throbbing",ariaLabel:"Throbbing pulsing pain",icon:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
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
    </svg>`},{id:"pressure",ariaLabel:"Pressing heavy pain",icon:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
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
    </svg>`},{id:"aching",ariaLabel:"Dull aching pain",icon:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
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
    </svg>`},{id:"tingling",ariaLabel:"Tingling pins and needles",icon:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible">
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
    </svg>`}];function G(a,{bodyPart:t="",fromScreen:i="#body-map"}={}){a.innerHTML="";const e=document.createElement("main");e.className="screen pain-type-screen",e.append(y());const s=t?`<p class="pain-type-subtitle">(${t})</p>`:"";e.insertAdjacentHTML("beforeend",`
    <header class="top-bar pain-type-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${o.backChevron}" alt=""/>
      </button>
    </header>

    <div class="pain-type-heading-wrap">
      <h1 class="pain-type-title">What kind of pain is it?</h1>
      ${s}
    </div>

    <div class="pain-type-grid" role="group" aria-label="Pain types">
      ${O.map(r=>`
        <button type="button" class="pain-card" data-id="${r.id}" aria-label="${r.ariaLabel}" aria-pressed="false">
          <div class="pain-card-icon">${r.icon}</div>
        </button>
      `).join("")}
    </div>

    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn" disabled>Next</button>
    </div>
  `);const n=e.querySelector(".pain-type-next-btn");e.querySelectorAll(".pain-card").forEach(r=>{r.addEventListener("click",()=>{e.querySelectorAll(".pain-card").forEach(l=>{l.classList.remove("pain-card--selected"),l.setAttribute("aria-pressed","false")}),r.classList.add("pain-card--selected"),r.setAttribute("aria-pressed","true"),n.disabled=!1})}),e.querySelector(".back-button").addEventListener("click",()=>{window.location.hash=i}),e.querySelector(".pain-type-back-btn").addEventListener("click",()=>{window.location.hash=i}),n.addEventListener("click",()=>{window.location.hash="#when-did-it-start"}),a.append(e)}function Z(){return`<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
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
  </svg>`}function W(){return`<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
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
  </svg>`}function X(){return`<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
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
  </svg>`}function V(){return`<svg viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events:none;overflow:visible;width:110px;height:78px">
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
  </svg>`}const U=[{id:"after-food",label:"After Food",svg:Z},{id:"after-play",label:"After Play",svg:W},{id:"dont-know",label:"I don't know",svg:X},{id:"after-sleep",label:"After Sleep",svg:V}];function _(a,{painDesc:t="",fromScreen:i="#pain-type"}={}){a.innerHTML="";const e=document.createElement("main");e.className="screen when-screen",e.append(y());const s=t?`<p class="when-subtitle">(${t})</p>`:"";e.insertAdjacentHTML("beforeend",`
    <header class="top-bar when-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${o.backChevron}" alt=""/>
      </button>
    </header>

    <div class="when-heading-wrap">
      <h1 class="when-title">When did it start?</h1>
      ${s}
    </div>

    <div class="when-grid" role="group" aria-label="When did the pain start">
      ${U.map(r=>`
        <button type="button" class="when-card" data-id="${r.id}" aria-label="${r.label}" aria-pressed="false">
          <div class="when-card-illustration">${r.svg()}</div>
          <div class="when-card-underline"></div>
          <span class="when-card-label">${r.label}</span>
        </button>
      `).join("")}
    </div>

    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn" disabled>Next</button>
    </div>
  `);const n=e.querySelector(".pain-type-next-btn");e.querySelectorAll(".when-card").forEach(r=>{r.addEventListener("click",()=>{e.querySelectorAll(".when-card").forEach(l=>{l.classList.remove("when-card--selected"),l.setAttribute("aria-pressed","false")}),r.classList.add("when-card--selected"),r.setAttribute("aria-pressed","true"),n.disabled=!1})}),e.querySelector(".back-button").addEventListener("click",()=>{window.location.hash=i}),e.querySelector(".pain-type-back-btn").addEventListener("click",()=>{window.location.hash=i}),n.addEventListener("click",()=>{window.location.hash="#pain-scale"}),a.append(e)}function K(a=[]){const t=new Set(a),i=e=>t.has(e)?"rgba(255,80,60,.55)":"transparent";return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 360" style="width:100%;height:100%;display:block">
<defs><style>
.b{fill:#FFE8A0;stroke:#48AFA2;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.j{fill:#FFD870;stroke:#48AFA2;stroke-width:1.5}
</style></defs>
<ellipse class="b" cx="100" cy="30" rx="28" ry="30"/>
<ellipse class="b" cx="72" cy="30" rx="5" ry="6.5"/>
<ellipse class="b" cx="128" cy="30" rx="5" ry="6.5"/>
<circle fill="#3a2a18" cx="88" cy="28" r="4"/>
<circle fill="#3a2a18" cx="112" cy="28" r="4"/>
<circle fill="#fff" cx="89.5" cy="26.5" r="1.6"/>
<circle fill="#fff" cx="113.5" cy="26.5" r="1.6"/>
<circle fill="#c07850" cx="100" cy="34" r="2.2"/>
<path fill="none" stroke="#c07850" stroke-width="2" stroke-linecap="round" d="M92 41 Q100 48 108 41"/>
<ellipse fill="#f0a888" opacity=".55" cx="81" cy="38" rx="7" ry="5"/>
<ellipse fill="#f0a888" opacity=".55" cx="119" cy="38" rx="7" ry="5"/>
<rect class="b" x="92" y="58" width="16" height="16" rx="6"/>
<rect class="b" x="44" y="70" width="112" height="72" rx="20"/>
<line fill="none" stroke="#48AFA2" stroke-width=".9" stroke-dasharray="4 3" opacity=".4" x1="46" y1="108" x2="154" y2="108"/>
<rect class="b" x="42" y="138" width="116" height="48" rx="22"/>
<rect class="b" x="20" y="72" width="26" height="60" rx="13"/>
<ellipse class="j" cx="33" cy="134" rx="11" ry="8"/>
<rect class="b" x="17" y="140" width="22" height="56" rx="11"/>
<ellipse class="j" cx="28" cy="197" rx="9" ry="6"/>
<ellipse class="b" cx="28" cy="212" rx="14" ry="16"/>
<rect class="b" x="154" y="72" width="26" height="60" rx="13"/>
<ellipse class="j" cx="167" cy="134" rx="11" ry="8"/>
<rect class="b" x="161" y="140" width="22" height="56" rx="11"/>
<ellipse class="j" cx="172" cy="197" rx="9" ry="6"/>
<ellipse class="b" cx="172" cy="212" rx="14" ry="16"/>
<rect class="b" x="46" y="182" width="34" height="68" rx="17"/>
<ellipse class="j" cx="63" cy="252" rx="14" ry="9"/>
<rect class="b" x="120" y="182" width="34" height="68" rx="17"/>
<ellipse class="j" cx="137" cy="252" rx="14" ry="9"/>
<rect class="b" x="48" y="258" width="30" height="68" rx="15"/>
<ellipse class="j" cx="63" cy="328" rx="12" ry="7"/>
<rect class="b" x="122" y="258" width="30" height="68" rx="15"/>
<ellipse class="j" cx="137" cy="328" rx="12" ry="7"/>
<ellipse class="b" cx="60" cy="340" rx="20" ry="11"/>
<ellipse class="b" cx="140" cy="340" rx="20" ry="11"/>
<ellipse fill="${i("head")}"         cx="100" cy="30"  rx="32" ry="34"/>
<rect    fill="${i("chest")}"        x="42"  y="70"  width="116" height="40" rx="4"/>
<rect    fill="${i("abdomen")}"      x="42"  y="108" width="116" height="34" rx="4"/>
<rect    fill="${i("hips")}"         x="40"  y="140" width="120" height="46" rx="4"/>
<rect    fill="${i("left-arm")}"     x="20"  y="72"  width="24"  height="68" rx="12"/>
<rect    fill="${i("right-arm")}"    x="156" y="72"  width="24"  height="68" rx="12"/>
<rect    fill="${i("left-forearm")}" x="16"  y="144" width="22" height="58" rx="11"/>
<rect    fill="${i("right-forearm")}" x="162" y="144" width="22" height="58" rx="11"/>
<ellipse fill="${i("left-hand")}"   cx="27"  cy="216" rx="16" ry="14"/>
<ellipse fill="${i("right-hand")}"  cx="173" cy="216" rx="16" ry="14"/>
<rect    fill="${i("left-thigh")}"  x="44"  y="184" width="36" height="72" rx="4"/>
<rect    fill="${i("right-thigh")}" x="120" y="184" width="36" height="72" rx="4"/>
<rect    fill="${i("left-shin")}"   x="44"  y="258" width="36" height="72" rx="4"/>
<rect    fill="${i("right-shin")}"  x="120" y="258" width="36" height="72" rx="4"/>
<ellipse fill="${i("left-foot")}"  cx="62"  cy="344" rx="22" ry="12"/>
<ellipse fill="${i("right-foot")}" cx="138" cy="344" rx="22" ry="12"/>
</svg>`}function M(a){const t=a<=2?"#50C890":a<=4?"#90C840":a<=6?"#FFB830":a<=8?"#FF8030":"#FF3830",i=(a-1)/9,e=64-i*24,s=i<.5?`<path d="M28 32 Q32 28 36 32" stroke="${t}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`:`<path d="M28 30 Q32 34 36 30" stroke="${t}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,n=i<.5?`<path d="M44 32 Q48 28 52 32" stroke="${t}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`:`<path d="M44 30 Q48 34 52 30" stroke="${t}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,r=a>=8?`<ellipse cx="56" cy="26" rx="3" ry="4" fill="#8CC8FF" opacity="0.8"/>
       <polygon points="56,20 53,26 59,26" fill="#8CC8FF" opacity="0.8"/>`:"",l=a>=9?`<ellipse cx="30" cy="42" rx="2" ry="3" fill="#8CC8FF" opacity="0.7"/>
       <ellipse cx="50" cy="42" rx="2" ry="3" fill="#8CC8FF" opacity="0.7"/>`:"";return`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <circle cx="40" cy="40" r="34" fill="${t}" opacity="0.18"/>
    <circle cx="40" cy="40" r="26" fill="${t}" opacity="0.9"/>
    ${s}
    ${n}
    <path d="M32,52 Q40,${e} 48,52" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${r}
    ${l}
  </svg>`}const J=["","No pain","Very mild","Mild","Moderate","Noticeable","Moderate-severe","Severe","Very severe","Intense","Worst possible"];function ee(a,{painDesc:t="",selectedZones:i=[],fromScreen:e="#when-did-it-start"}={}){a.innerHTML="";const s=document.createElement("main");s.className="screen pain-scale-screen",s.append(y());const n=t?`<p class="pain-scale-subtitle">(${t})</p>`:"";s.insertAdjacentHTML("beforeend",`
    <header class="top-bar pain-scale-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${o.backChevron}" alt=""/>
      </button>
    </header>

    <div class="pain-scale-body-wrap">
      <div class="pain-scale-body-svg" id="miniBody">${K(i)}</div>
    </div>

    <div class="pain-scale-heading-wrap">
      <h1 class="pain-scale-title">How much is the pain?</h1>
      ${n}
    </div>

    <div class="pain-scale-face-card" id="painFaceCard">
      <div class="pain-scale-face" id="painFace">${M(1)}</div>
      <span class="pain-scale-level-label" id="painLevelLabel">1 — No pain</span>
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
  `);const r=s.querySelector("#painSlider"),l=s.querySelector("#painFace"),d=s.querySelector("#painFaceCard"),g=s.querySelector("#painLevelLabel");function b(){const f=Number(r.value);l.innerHTML=M(f),g.textContent=`${f} — ${J[f]||""}`;const c=(f-1)/9*100;r.style.setProperty("--fill",`${c}%`);const p=.15+f/10*.35;d.style.borderColor=`rgba(255,111,97,${p})`}r.addEventListener("input",b),b(),s.querySelector(".back-button").addEventListener("click",()=>{window.location.hash=e}),s.querySelector(".pain-type-back-btn").addEventListener("click",()=>{window.location.hash=e}),s.querySelector(".pain-type-next-btn").addEventListener("click",()=>{window.location.hash="#pain-summary"}),a.append(s)}let u="#get-started";function B(){const a=document.querySelector("#app");if(!a)return;const t=window.location.hash||"#get-started";if(t==="#select-role"){H(a);return}if(t==="#homepage-newuser"){Q(a);return}if(t==="#child-added"){Y(a);return}if(t==="#second-child-added"){j(a);return}if(t==="#body-map"){const i=["#child-added","#second-child-added"].includes(u)?u:"#child-added";R(a,{fromScreen:i});return}if(t==="#pain-type"){G(a,{fromScreen:"#body-map"});return}if(t==="#when-did-it-start"){_(a,{fromScreen:"#pain-type"});return}if(t==="#pain-scale"){ee(a,{fromScreen:"#when-did-it-start"});return}T(a)}window.addEventListener("hashchange",a=>{u=new URL(a.oldURL).hash||"#get-started",B()});window.location.hash||(window.location.hash="#get-started");B();
