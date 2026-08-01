import { ASSETS } from "../assets";
import { startGuidedTour } from "../appTour";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";
  window.clearTimeout(window.__nanaLandingReadyTimer);

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen page-animate-in";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome</h1>

    <p class="welcome-copy">Create your account to start using Nana.</p>

    <section class="app-thumbnail app-thumbnail--text-logo" aria-label="Nana the App logo">
      <img src="${ASSETS.logoFull}" alt="Nana the App" class="thumbnail-mark thumbnail-mark--text" />
    </section>

    <button type="button" class="continue-button get-started-button">
      Get Started
    </button>

    <button type="button" class="landing-install-link" data-landing-action="install">
      Add Nana to Home Screen
    </button>

    <p class="tagline">a visual voice for where and when it hurts</p>
  `);

  screen.querySelector(".get-started-button")?.addEventListener("click", () => {
    startGuidedTour({ force: true });
    window.location.hash = "#select-role";
  });

  screen.querySelectorAll("[data-landing-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.landingAction;

      if (action === "install") {
        window.dispatchEvent(new CustomEvent("nana:show-install-prompt", {
          detail: { force: true },
        }));
      }
    });
  });

  app.append(screen);
}
