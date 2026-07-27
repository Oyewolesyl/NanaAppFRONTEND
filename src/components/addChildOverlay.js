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

  if (closest) closest.classList.add("is-selected");
}

export function createAddChildOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "add-child-overlay";
  overlay.hidden = true;
  overlay.dataset.photoUrl = '';
  overlay.dataset.editChildId = '';

  overlay.innerHTML = `
    <div class="add-child-backdrop" data-close-overlay="true"></div>
    <section class="add-child-modal" aria-label="Add or edit child">
      <button type="button" class="add-image-card" aria-label="Choose child image">
        <span class="add-image-icon-wrap">
          <img class="add-child-preview" src="${ASSETS.inactiveChildPhoto}" alt="Child preview" />
        </span>
        <span class="add-image-action" aria-hidden="true">Add image from Gallery</span>
      </button>
      <input class="add-child-file" type="file" accept="image/*" hidden />
      <label class="child-name-field">
        <input data-child-name type="text" placeholder="Child's Name" />
      </label>
      <h3 class="age-title">Select Age</h3>
      <div class="age-wheel-shell">
        <div class="age-wheel-fade age-wheel-fade--top"></div>
        <ul class="age-wheel" aria-label="Age selection"></ul>
        <div class="age-wheel-fade age-wheel-fade--bottom"></div>
      </div>
      <button type="button" class="save-child-button">Save</button>
    </section>
  `;

  const wheel = overlay.querySelector(".age-wheel");
  createAgeWheelItems(wheel);

  function selectAge(age = 4) {
    // The age wheel stays native-scroll for phone ergonomics; the selected
    // value is whichever item is visually closest to the center line.
    const item = wheel.querySelector(`[data-age="${age}"]`) || wheel.querySelector('[data-age="4"]');
    setTimeout(() => {
      item?.scrollIntoView({ block: 'center' });
      updateAgeSelection(wheel);
    }, 0);
  }

  selectAge(4);

  let scrollTimer = null;
  wheel.addEventListener("scroll", () => {
    updateAgeSelection(wheel);
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const selected = wheel.querySelector(".age-wheel-item.is-selected");
      selected?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
  });

  const fileInput = overlay.querySelector('.add-child-file');
  const preview = overlay.querySelector('.add-child-preview');
  overlay.querySelector('.add-image-card')?.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Images stay local as data URLs in this build, so adding a profile photo
      // is instant and does not depend on external storage being configured.
      overlay.dataset.photoUrl = String(reader.result || '');
      preview.src = overlay.dataset.photoUrl;
    };
    reader.readAsDataURL(file);
  });

  overlay.resetForm = (child = null) => {
    overlay.dataset.editChildId = child?.id || '';
    overlay.dataset.photoUrl = child?.photo_url || '';
    overlay.querySelector('[data-child-name]').value = child?.name || '';
    preview.src = child?.photo_url || ASSETS.inactiveChildPhoto;
    fileInput.value = '';
    selectAge(child?.age || 4);
  };

  return overlay;
}
