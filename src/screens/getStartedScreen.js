import { ASSETS } from "../assets";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome to</h1>

    <section class="app-thumbnail" aria-label="Nana app logo card">
      <img src="${ASSETS.logoMark}" alt="Nana the app" class="thumbnail-mark" />
    </section>

    <button type="button" class="continue-button get-started-button">Get Started</button>

    <p class="tagline">a visual voice for where and when it hurts</p>
  `);

  screen.querySelector(".get-started-button")?.addEventListener("click", () => {
    window.location.hash = "#select-role";
  });

  app.append(screen);
}
