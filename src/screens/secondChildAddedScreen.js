import { ASSETS } from "../assets";
import { createStatusBar } from "../components/statusBar";

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
  screen.append(createStatusBar());

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
      <img src="${ASSETS.floatingAddButtonAlt}" alt="" />
    </button>

    <nav class="bottom-nav" aria-label="Main navigation">
      <button type="button" class="bottom-nav-item bottom-nav-item--home bottom-nav-item--active" aria-label="Home">
        <span class="bottom-nav-sprite bottom-nav-sprite--home" aria-hidden="true"></span>
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--activity" aria-label="Activity">
        <img src="${ASSETS.navClock}" alt="" />
      </button>
      <button type="button" class="bottom-nav-item bottom-nav-item--settings" aria-label="Settings">
        <span class="bottom-nav-sprite bottom-nav-sprite--settings" aria-hidden="true"></span>
      </button>
    </nav>
  `,
  );

  app.append(screen);
}
