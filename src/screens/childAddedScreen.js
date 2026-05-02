import { ASSETS } from "../assets";
import { createAddChildOverlay } from "../components/addChildOverlay";

export function renderChildAddedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen children-screen child-added-screen";

  screen.insertAdjacentHTML(
    "beforeend",
    `
    <header class="children-header">
      <img src="${ASSETS.splashHeaderLogo}" alt="Nana logo" class="children-header-logo" />
      <button type="button" aria-label="Open menu" class="children-menu-button">
        <img src="${ASSETS.splashMenuIcon}" alt="" />
      </button>
    </header>

    <section class="child-added-intro">
      <h1 class="children-title children-title--small">Your Children</h1>
    </section>

    <section class="child-card-list">
      <article class="child-card">
        <div class="child-card-photo-wrap">
          <img src="${ASSETS.childPhoto}" alt="Sunny" class="child-card-photo" />
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

  // Open Body Map button → body map screen (to be built)
  screen.querySelectorAll(".child-open-map-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = "#body-map";
    });
  });

  // Floating + button → open add child overlay
  const overlay = createAddChildOverlay();
  screen.append(overlay);

  const floatingBtn = screen.querySelector(".floating-add-btn");
  floatingBtn?.addEventListener("click", () => {
    overlay.hidden = false;
  });

  overlay.querySelectorAll("[data-close-overlay='true']").forEach((node) => {
    node.addEventListener("click", () => {
      overlay.hidden = true;
    });
  });

  // Save in overlay → go to second-child-added
  const saveButton = overlay.querySelector(".save-child-button");
  saveButton?.addEventListener("click", () => {
    window.location.hash = "#second-child-added";
  });

  app.append(screen);
}