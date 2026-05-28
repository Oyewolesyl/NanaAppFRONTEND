import { ASSETS } from "../assets";
import { mountMiniBody } from "../miniBody3d";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome to</h1>

    <section class="app-thumbnail" aria-label="Nana app logo card">
      <img src="${ASSETS.logoMark}" alt="Nana the app" class="thumbnail-mark" />
    </section>

    <section class="welcome-body-preview" aria-label="Rotating body map preview">
      <div class="welcome-body-orbit"></div>
    </section>

    <button type="button" class="continue-button get-started-button">
      Get Started
    </button>

    <p class="tagline">a visual voice for where and when it hurts</p>
  `);

  screen.querySelector(".get-started-button")?.addEventListener("click", () => {
    window.location.hash = "#select-role";
  });

  app.append(screen);

  const bodyPreview = screen.querySelector(".welcome-body-orbit");
  if (bodyPreview) {
    mountMiniBody(bodyPreview, {
      rotate: true,
      rotateSpeed: 0.0028,
      showLabel: false,
      canvasClassName: "welcome-body-canvas",
    });
  }
}
