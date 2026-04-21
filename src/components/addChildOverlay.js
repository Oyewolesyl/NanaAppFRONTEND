import { ASSETS } from "../assets";

function createAgeWheelItems(wheelList) {
  const spacerTop = document.createElement("li");
  spacerTop.className = "age-wheel-spacer";
  wheelList.append(spacerTop);

  for (let age = 1; age <= 18; age += 1) {
    const item = document.createElement("li");
    item.className = "age-wheel-item";
    item.textContent = String(age);
    item.dataset.age = String(age);
    wheelList.append(item);
  }

  const spacerBottom = document.createElement("li");
  spacerBottom.className = "age-wheel-spacer";
  wheelList.append(spacerBottom);
}

function updateAgeSelection(wheel) {
  const rect = wheel.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  let closest = null;
  let minDistance = Number.POSITIVE_INFINITY;

  wheel.querySelectorAll(".age-wheel-item").forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenterY = itemRect.top + itemRect.height / 2;
    const distance = Math.abs(itemCenterY - centerY);
    item.classList.remove("is-selected");
    if (distance < minDistance) {
      minDistance = distance;
      closest = item;
    }
  });

  if (closest) {
    closest.classList.add("is-selected");
  }
}

export function createAddChildOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "add-child-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <div class="add-child-backdrop" data-close-overlay="true"></div>
    <section class="add-child-modal" aria-label="Add child">
      <div class="add-image-card">
        <div class="add-image-icon-wrap">
          <img class="add-image-circle" src="${ASSETS.overlayCircle}" alt="" />
          <img class="add-image-plus" src="${ASSETS.overlayPlus}" alt="" />
        </div>
        <button type="button" class="add-image-action">+ Add image from Gallery</button>
      </div>
      <label class="child-name-field">
        <input type="text" placeholder="Child's Name" />
      </label>
      <h3 class="age-title">Select Age</h3>
      <div class="age-wheel-shell">
        <div class="age-wheel-fade age-wheel-fade--top"></div>
        <ul class="age-wheel" aria-label="Age selection"></ul>
        <div class="age-wheel-fade age-wheel-fade--bottom"></div>
      </div>
      <button type="button" class="save-child-button" data-close-overlay="true">Save</button>
    </section>
  `;

  const wheel = overlay.querySelector(".age-wheel");
  if (!wheel) return overlay;

  createAgeWheelItems(wheel);
  setTimeout(() => {
    wheel.scrollTop = 31 * 2;
    updateAgeSelection(wheel);
  }, 0);

  let scrollTimer = null;
  wheel.addEventListener("scroll", () => {
    updateAgeSelection(wheel);
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const selected = wheel.querySelector(".age-wheel-item.is-selected");
      selected?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
  });

  return overlay;
}
