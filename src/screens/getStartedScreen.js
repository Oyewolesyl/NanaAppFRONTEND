import { ASSETS } from "../assets";
import { startGuidedTour } from "../appTour";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";
  document.body.classList.remove("nana-landing-ready");

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen page-animate-in";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome</h1>

    <p class="welcome-copy">Create your account to start using Nana.</p>

    <section class="app-thumbnail app-thumbnail--text-logo" aria-label="Nana the App logo">
      <img src="${ASSETS.logoFull}" alt="Nana the App" class="thumbnail-mark thumbnail-mark--text" />
    </section>

    <div class="landing-ai-wink" aria-hidden="true">
      <span class="assistant-wink-icon" aria-hidden="true">
        <span class="landing-css-face" aria-hidden="true">
          <i class="landing-css-face__eye landing-css-face__eye--left"></i>
          <i class="landing-css-face__eye landing-css-face__eye--right"></i>
          <i class="landing-css-face__smile"></i>
        </span>
        <img src="${ASSETS.logoMark}" alt="" class="landing-wink-fallback" />
        <img src="${ASSETS.winkFace1}" alt="" class="assistant-wink-frame assistant-wink-frame--one" />
        <img src="${ASSETS.winkFace2}" alt="" class="assistant-wink-frame assistant-wink-frame--two" />
        <img src="${ASSETS.winkFace3}" alt="" class="assistant-wink-frame assistant-wink-frame--three" />
      </span>
    </div>

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

  const splash = screen.querySelector(".landing-ai-wink");
  if (splash) {
    // Keep the splash outside the animated screen container. Transforms on a
    // parent can trap position: fixed on tablet/desktop and create blue offsets.
    document.body.append(splash);
  }

  window.setTimeout(() => {
    screen.classList.add("get-started-screen--ready");
    document.body.classList.add("nana-landing-ready");
  }, 3200);

}
