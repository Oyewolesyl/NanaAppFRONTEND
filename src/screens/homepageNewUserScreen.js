import { ASSETS } from "../assets";
import { createAddChildOverlay } from "../components/addChildOverlay";
import { createStatusBar } from "../components/statusBar";

export function renderHomepageNewUserScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen children-screen";
  screen.append(createStatusBar());

  screen.insertAdjacentHTML("beforeend", `
    <header class="children-header">
      <img src="${ASSETS.splashHeaderLogo}" alt="Nana logo" class="children-header-logo" />
      <button type="button" aria-label="Open menu" class="children-menu-button">
        <img src="${ASSETS.splashMenuIcon}" alt="" />
      </button>
    </header>

    <section class="children-intro">
      <h1 class="children-title">Your Children</h1>
      <p class="children-subtitle">will be listed here</p>
    </section>

    <section class="children-add-section">
      <h2 class="children-add-title">Tap to add a Child</h2>
      <button type="button" class="children-add-button" aria-label="Add child">
        <img src="${ASSETS.splashAddButton}" alt="" />
      </button>
    </section>

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
  `);

  const overlay = createAddChildOverlay();
  screen.append(overlay);

  const openButton = screen.querySelector(".children-add-button");
  openButton?.addEventListener("click", () => {
    overlay.hidden = false;
  });

  overlay.querySelectorAll("[data-close-overlay='true']").forEach((node) => {
    node.addEventListener("click", () => {
      overlay.hidden = true;
    });
  });

  const saveButton = overlay.querySelector(".save-child-button");
  saveButton?.addEventListener("click", () => {
    window.location.hash = "#child-added";
  });

  app.append(screen);
}
