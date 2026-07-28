import { ASSETS } from "../assets";
import { mountMiniBody } from "../miniBody3d";
import { startGuidedTour } from "../appTour";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";
  document.body.classList.remove("nana-landing-ready");

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen page-animate-in";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome</h1>

    <section class="app-thumbnail app-thumbnail--text-logo" aria-label="Nana the App logo">
      <img src="${ASSETS.logoText}" alt="Nana the App" class="thumbnail-mark thumbnail-mark--text" />
    </section>

    <div class="landing-ai-wink" aria-hidden="true">
      <span class="assistant-wink-icon" aria-hidden="true">
        <span class="landing-css-face">
          <span class="landing-css-face__eye landing-css-face__eye--left"></span>
          <span class="landing-css-face__eye landing-css-face__eye--right"></span>
          <span class="landing-css-face__smile"></span>
        </span>
        <img src="${ASSETS.logoMark}" alt="" class="landing-wink-fallback" />
        <img src="${ASSETS.winkFace1}" alt="" class="assistant-wink-frame assistant-wink-frame--one" />
        <img src="${ASSETS.winkFace2}" alt="" class="assistant-wink-frame assistant-wink-frame--two" />
        <img src="${ASSETS.winkFace3}" alt="" class="assistant-wink-frame assistant-wink-frame--three" />
      </span>
    </div>

    <section class="welcome-logo-stage" aria-label="Nana opening preview">
      <section class="welcome-body-preview" aria-label="Rotating body map preview">
        <div class="welcome-body-orbit"></div>
      </section>
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

  const bodyPreview = screen.querySelector(".welcome-body-orbit");
  if (bodyPreview) {
    mountMiniBody(bodyPreview, {
      rotate: true,
      rotateSpeed: 0.0065,
      showLabel: false,
      canvasClassName: "welcome-body-canvas",
    });
  }
}
