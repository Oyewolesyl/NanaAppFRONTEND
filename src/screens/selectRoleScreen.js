import { ASSETS } from "../assets";

export function renderSelectRoleScreen(app) {
  app.innerHTML = "";

  const screen = document.createElement("main");
  screen.className = "screen select-role-screen";

  screen.insertAdjacentHTML("beforeend", `
    <header class="top-bar">
      <button class="back-button" type="button" aria-label="Go back">
        <img src="${ASSETS.backChevron}" alt="" />
      </button>
    </header>
    <h1 class="screen-title">Who are you?</h1>

    <section class="role-options">

      <article class="role-option" data-role="parent">
        <div class="role-icon role-icon--parent">
          <img src="${ASSETS.caregiverIcon}" alt="Parent illustration" class="role-icon-image" />
        </div>
        <button class="role-button" type="button" data-role="parent">
          Parent / Caregiver
        </button>
      </article>

      <article class="role-option" data-role="doctor">
        <div class="role-icon role-icon--doctor">
          <img src="${ASSETS.doctorIcon}" alt="Doctor illustration" class="role-icon-image" />
        </div>
        <button class="role-button" type="button" data-role="doctor">
          Doctor / Professional
        </button>
      </article>

    </section>

    <button class="continue-button" type="button" disabled>Continue</button>
  `);

  let selectedRole = null;
  const continueBtn = screen.querySelector(".continue-button");

  function selectRole(role) {
    selectedRole = role;

    screen.querySelectorAll(".role-button").forEach(b => {
      b.classList.toggle("role-button--selected", b.dataset.role === role);
    });
    screen.querySelectorAll(".role-option").forEach(c => {
      c.classList.toggle("role-option--selected", c.dataset.role === role);
    });

    continueBtn.disabled = false;
  }

  /* clicking anywhere on the card (icon or button) selects it */
  screen.querySelectorAll(".role-option").forEach(card => {
    card.addEventListener("click", () => selectRole(card.dataset.role));
  });

  screen.querySelector(".back-button").addEventListener("click", () => {
    window.location.hash = "#get-started";
  });

  continueBtn.addEventListener("click", () => {
    if (selectedRole) window.location.hash = "#homepage-newuser";
  });

  app.append(screen);
}