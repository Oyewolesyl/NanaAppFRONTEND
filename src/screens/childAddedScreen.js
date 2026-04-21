import { ASSETS } from "../assets";
import { createStatusBar } from "../components/statusBar";
import { createAddChildOverlay } from "../components/addChildOverlay";

export function renderChildAddedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen children-screen child-added-screen";
  screen.append(createStatusBar());

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
      <img src="${ASSETS.floatingAddButton}" alt="" />
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

  // Open Body Map button → body map screen (to be built)
  const openMapBtn = screen.querySelector(".child-open-map-btn");
  openMapBtn?.addEventListener("click", () => {
    window.location.hash = "#body-map";
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