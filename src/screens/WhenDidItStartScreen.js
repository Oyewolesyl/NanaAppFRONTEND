import { ASSETS } from "../assets";
import { updatePainDraft, appState } from "../appState";
import { childContextHtml, painProgressHtml } from "../sharedUi";

const AFTERFOOD_IMG = "/when-start/after-food.png";
const AFTERPLAY_IMG = "/when-start/after-play.png";
const AFTERSLEEP_IMG = "/when-start/after-sleep.png";
const IDK_IMG = "/when-start/dont-know.png";

const WHEN_TYPES = [
  { id: "after-food",  label: "After Food",   img: AFTERFOOD_IMG },
  { id: "after-play",  label: "After Play",   img: AFTERPLAY_IMG },
  { id: "dont-know",   label: "I don't know", img: IDK_IMG },
  { id: "after-sleep", label: "After Sleep",  img: AFTERSLEEP_IMG },
];

export function renderWhenDidItStartScreen(app, { painDesc = "", fromScreen = "#pain-type" } = {}) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen when-screen page-animate-in";

  const subtitle = painDesc ? `<p class="when-subtitle">(${painDesc})</p>` : "";

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar when-top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt=""/>
      </button>
    </header>

    <div class="when-heading-wrap">
      <h1 class="when-title">When did it start?</h1>
      ${childContextHtml()}
      ${subtitle}
    </div>

    <div class="when-grid" role="group" aria-label="When did the pain start">
      ${WHEN_TYPES.map(w => `
        <button type="button" class="when-card" data-id="${w.id}" aria-label="${w.label}" aria-pressed="false">
          <div class="when-card-illustration">
            <img src="${w.img}" alt="${w.label}" style="width:110px;height:78px;object-fit:cover;border-radius:8px;"/>
          </div>
          <div class="when-card-underline"></div>
          <span class="when-card-label">${w.label}</span>
        </button>
      `).join("")}
    </div>

    <div class="pain-type-actions">
      <button type="button" class="pain-type-back-btn">Back</button>
      <button type="button" class="pain-type-next-btn" ${appState.painDraft.started ? "" : "disabled"}>Next</button>
    </div>
  `);

  const nextBtn = screen.querySelector(".pain-type-next-btn");

  screen.querySelectorAll(".when-card").forEach(card => {
    card.addEventListener("click", () => {
      screen.querySelectorAll(".when-card").forEach(c => {
        c.classList.remove("when-card--selected");
        c.setAttribute("aria-pressed", "false");
      });
      card.classList.add("when-card--selected");
      card.setAttribute("aria-pressed", "true");
      updatePainDraft({ started: card.dataset.id });
      nextBtn.disabled = false;
    });
  });

  screen.querySelector(".back-button").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });
  screen.querySelector(".pain-type-back-btn").addEventListener("click", () => {
    window.location.hash = fromScreen;
  });
  nextBtn.addEventListener("click", () => {
    window.location.hash = "#pain-scale";
  });

  app.append(screen);
}
