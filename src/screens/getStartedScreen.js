import { ASSETS } from "../assets";
import { mountMiniBody } from "../miniBody3d";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen page-animate-in";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome to</h1>

    <section class="app-thumbnail" aria-label="Nana app logo card">
      <img src="${ASSETS.logoMark}" alt="Nana the app" class="thumbnail-mark" />
    </section>

    <section class="welcome-body-preview" aria-label="Rotating body map preview">
      <div class="welcome-body-orbit"></div>
    </section>

    <section class="landing-feature-guide" aria-label="How Nana works">
      <button type="button" class="landing-feature-card" data-landing-action="profile">
        <span>01</span>
        <strong>Add a child profile</strong>
        <em>Keep each pain report connected to the right child.</em>
      </button>

      <button type="button" class="landing-feature-card" data-landing-action="map">
        <span>02</span>
        <strong>Tap the 3D body map</strong>
        <em>Show exactly where it hurts with a visual body model.</em>
      </button>

      <button type="button" class="landing-feature-card" data-landing-action="report">
        <span>03</span>
        <strong>Describe the pain</strong>
        <em>Capture feeling, timing, intensity, and notes in one flow.</em>
      </button>

      <button type="button" class="landing-feature-card" data-landing-action="assistant">
        <span>04</span>
        <strong>Get a handoff plan</strong>
        <em>Nana Assistant turns reports into a caregiver-ready summary.</em>
      </button>
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
    window.location.hash = "#select-role";
  });

  screen.querySelectorAll("[data-landing-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.landingAction;

      if (action === "map" || action === "report") {
        window.location.hash = "#body-map";
        return;
      }

      if (action === "assistant") {
        window.location.hash = "#assistant";
        return;
      }

      if (action === "install") {
        window.dispatchEvent(new CustomEvent("nana:show-install-prompt", {
          detail: { force: true },
        }));
        return;
      }

      window.location.hash = "#select-role";
    });
  });

  app.append(screen);

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
