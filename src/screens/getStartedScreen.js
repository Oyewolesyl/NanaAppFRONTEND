import { ASSETS } from "../assets";
import { mountMiniBody } from "../miniBody3d";

const LANDING_HINTS = {
  profile: {
    eyebrow: "step 01",
    title: "Add a child profile",
    body: "Create one child profile first so every pain report, care note, and assistant summary stays connected to the right child.",
    bullets: ["save the child's name and age", "add or update a photo later", "keep reports separated per child"],
    action: "Create profile",
    route: "#select-role",
  },
  map: {
    eyebrow: "step 02",
    title: "Tap the 3D body map",
    body: "Use the visual body map when words are not enough. Rotate, zoom, and select the exact spot before describing the pain.",
    bullets: ["rotate the body to inspect front and side views", "zoom in for smaller body areas", "continue only after choosing a spot"],
    action: "Open body map",
    route: "#body-map",
  },
  report: {
    eyebrow: "step 03",
    title: "Describe the pain",
    body: "Nana guides the report through feeling, timing, and intensity so the final note is structured instead of messy.",
    bullets: ["choose the pain feeling", "record when it started", "rate the pain level clearly"],
    action: "Start report",
    route: "#body-map",
  },
  assistant: {
    eyebrow: "step 04",
    title: "Get a handoff plan",
    body: "Nana Assistant turns saved pain reports into a caregiver-ready summary with attention level, trend, and next steps.",
    bullets: ["summarise the latest report", "highlight high-attention patterns", "prepare notes for a trusted adult or professional"],
    action: "Open assistant",
    route: "#assistant",
  },
};

function createLandingHintOverlay() {
  const overlay = document.createElement("aside");
  overlay.className = "landing-hint-overlay";
  overlay.hidden = true;
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("role", "dialog");
  overlay.innerHTML = `
    <div class="landing-hint-backdrop" data-close-landing-hint></div>
    <section class="landing-hint-panel">
      <button type="button" class="landing-hint-close" data-close-landing-hint aria-label="Close hint">x</button>
      <span class="landing-hint-eyebrow"></span>
      <h2 class="landing-hint-title"></h2>
      <p class="landing-hint-body"></p>
      <div class="landing-hint-steps"></div>
      <button type="button" class="landing-hint-action"></button>
    </section>
  `;

  // The landing page keeps one reusable dialog so every step behaves the same
  // and future handover work only has one hint pattern to maintain.
  document.querySelectorAll("body > .landing-hint-overlay").forEach((node) => node.remove());
  document.body.append(overlay);
  return overlay;
}

export function renderGetStartedScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen get-started-screen page-animate-in";

  screen.insertAdjacentHTML("beforeend", `
    <h1 class="welcome-title">Welcome</h1>

    <section class="app-thumbnail app-thumbnail--text-logo" aria-label="Nana the App logo">
      <img src="${ASSETS.logoText}" alt="Nana the App" class="thumbnail-mark thumbnail-mark--text" />
    </section>

    <button type="button" class="landing-ai-wink" data-landing-action="assistant" aria-label="Open Nana Assistant hint">
      <span class="assistant-wink-icon" aria-hidden="true">
        <img src="${ASSETS.winkFace1}" alt="" class="assistant-wink-frame assistant-wink-frame--one" />
        <img src="${ASSETS.winkFace2}" alt="" class="assistant-wink-frame assistant-wink-frame--two" />
        <img src="${ASSETS.winkFace3}" alt="" class="assistant-wink-frame assistant-wink-frame--three" />
      </span>
    </button>

    <section class="landing-flow-map" aria-label="Nana app flow">
      <button type="button" class="landing-flow-hotspot landing-flow-hotspot--profile" data-landing-action="profile">
        <span>01</span>
        <strong>profile</strong>
      </button>

      <button type="button" class="landing-flow-hotspot landing-flow-hotspot--map" data-landing-action="map">
        <span>02</span>
        <strong>body map</strong>
      </button>

      <section class="welcome-body-preview" aria-label="Rotating body map preview">
        <div class="welcome-body-orbit"></div>
      </section>

      <button type="button" class="landing-flow-hotspot landing-flow-hotspot--report" data-landing-action="report">
        <span>03</span>
        <strong>report</strong>
      </button>

      <button type="button" class="landing-flow-hotspot landing-flow-hotspot--assistant" data-landing-action="assistant">
        <img src="${ASSETS.logoMark}" alt="" />
        <strong>assistant</strong>
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

  const hintOverlay = createLandingHintOverlay();
  const hintEyebrow = hintOverlay.querySelector(".landing-hint-eyebrow");
  const hintTitle = hintOverlay.querySelector(".landing-hint-title");
  const hintBody = hintOverlay.querySelector(".landing-hint-body");
  const hintSteps = hintOverlay.querySelector(".landing-hint-steps");
  const hintAction = hintOverlay.querySelector(".landing-hint-action");

  function closeHint() {
    hintOverlay.hidden = true;
  }

  function openHint(action) {
    const hint = LANDING_HINTS[action];
    if (!hint) return;

    hintOverlay.dataset.action = action;
    hintEyebrow.textContent = hint.eyebrow;
    hintTitle.textContent = hint.title;
    hintBody.textContent = hint.body;
    hintAction.textContent = hint.action;
    hintSteps.innerHTML = hint.bullets
      .map((item, index) => `<p><span>${index + 1}</span>${item}</p>`)
      .join("");
    hintOverlay.hidden = false;
    hintAction.focus({ preventScroll: true });
  }

  hintOverlay.querySelectorAll("[data-close-landing-hint]").forEach((node) => {
    node.addEventListener("click", closeHint);
  });

  hintOverlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeHint();
  });

  hintAction.addEventListener("click", () => {
    const hint = LANDING_HINTS[hintOverlay.dataset.action];
    closeHint();
    if (hint?.route) window.location.hash = hint.route;
  });

  screen.querySelectorAll("[data-landing-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.landingAction;

      if (action === "install") {
        window.dispatchEvent(new CustomEvent("nana:show-install-prompt", {
          detail: { force: true },
        }));
        return;
      }

      openHint(action);
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
