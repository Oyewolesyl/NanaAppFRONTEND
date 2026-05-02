import { ASSETS } from "../assets";

function createChildCard({ name, ageText, photo }) {
  return `
    <article class="child-card child-card--compact">
      <div class="child-card-photo-wrap">
        <img src="${photo}" alt="${name}" class="child-card-photo" />
      </div>
      <div class="child-card-divider"></div>
      <div class="child-card-meta child-card-meta--compact">
        <p class="child-name">${name}</p>
        <p class="child-age">${ageText}</p>
      </div>
      <button type="button" class="child-open-map-btn child-open-map-btn--compact">Open Body Map</button>
    </article>
  `;
}

export function renderSecondChildAddedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen children-screen child-added-screen";

  screen.insertAdjacentHTML(
    "beforeend",
    `
    <header class="children-header children-header--logo-only">
      <img src="${ASSETS.splashHeaderLogo}" alt="Nana logo" class="children-header-logo children-header-logo--large" />
    </header>

    <section class="child-added-intro">
      <h1 class="children-title children-title--small">Your Children</h1>
    </section>

    <section class="child-card-list child-card-list--two">
      ${createChildCard({ name: "Sunny", ageText: "4 years Old", photo: ASSETS.childPhoto })}
      ${createChildCard({ name: "Leny", ageText: "8 years Old", photo: ASSETS.secondChildPhoto })}
    </section>

    <button type="button" class="floating-add-btn floating-add-btn--lower" aria-label="Add child">
      <svg width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="59" cy="58" r="50" fill="#FF6F61" filter="drop-shadow(0px 2px 9px rgba(0,0,0,0.25))"/>
        <line x1="59" y1="38" x2="59" y2="78" stroke="white" stroke-width="12" stroke-linecap="round"/>
        <line x1="39" y1="58" x2="79" y2="58" stroke="white" stroke-width="12" stroke-linecap="round"/>
      </svg>
    </button>

    <nav class="bottom-nav" aria-label="Main navigation">
      <button type="button" class="bottom-nav-item bottom-nav-item--home bottom-nav-item--active" aria-label="Home">
        <img src="${ASSETS.navHome}" alt="" />
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--activity" aria-label="Activity">
        <img src="${ASSETS.navClock}" alt="" />
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings" aria-label="Settings">
        <img src="${ASSETS.navSettingsInactive}" alt="" />
      </button>
    </nav>
  `,
  );

  app.append(screen);

  screen.querySelectorAll(".child-open-map-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = "#body-map";
    });
  });
}