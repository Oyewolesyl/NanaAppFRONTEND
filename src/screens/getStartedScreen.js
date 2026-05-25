import { ASSETS } from "../assets";
import { mountMiniBody } from "../miniBody3d";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen final-get-started-screen";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome to</h1>
    <section class="app-thumbnail" aria-label="Nana app logo card">
      <img src="${ASSETS.logoMark}" alt="Nana the app" class="thumbnail-mark" />
    </section>
    <div class="landing-body-stage" aria-label="Rotating body map preview">
      <div class="landing-wink" aria-hidden="true">😉</div>
      <div class="landing-mini-body"></div>
    </div>
    <button type="button" class="continue-button get-started-button">Get Started</button>
    <p class="tagline">“a visual voice for where and when it hurts”</p>
  `);

  mountMiniBody(screen.querySelector(".landing-mini-body"), { zones: [], rotate: true });

  screen.querySelector(".get-started-button")?.addEventListener("click", () => {
    window.location.hash = "#select-role";
  });

  app.append(screen);
}
