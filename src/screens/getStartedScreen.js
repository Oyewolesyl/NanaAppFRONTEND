import { ASSETS } from "../assets";

export function renderGetStartedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen";

  screen.insertAdjacentHTML("beforeend", `
    <img class="bg-teddy bg-teddy--top" src="${ASSETS.teddyBackground}" alt="" aria-hidden="true" />
    <img class="bg-teddy bg-teddy--bottom" src="${ASSETS.teddyBackground}" alt="" aria-hidden="true" />
    <h1 class="welcome-title">Welcome to</h1>
    <section class="app-thumbnail" aria-label="Nana app logo card">
      <img src="${ASSETS.logoMark}" alt="" class="thumbnail-mark" />
      <img src="${ASSETS.logoText}" alt="Nana the app" class="thumbnail-text" />
    </section>
    <button type="button" class="continue-button get-started-button">Get Started</button>
    <p class="tagline">“a visual voice for when it hurts”</p>
  `);

  const startButton = screen.querySelector(".get-started-button");
  startButton?.addEventListener("click", () => {
    window.location.hash = "#select-role";
  });

  app.append(screen);
}
