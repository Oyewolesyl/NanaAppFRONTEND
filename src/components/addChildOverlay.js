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

function scrollAgeIntoView(wheel, age) {
  const item = wheel.querySelector(`[data-age="${age}"]`);
  if (!item) return;
  setTimeout(() => {
    item.scrollIntoView({ block: "center", behavior: "instant" });
    updateAgeSelection(wheel);
  }, 0);
}

export function createAddChildOverlay({ onSave } = {}) {
  const overlay = document.createElement("div");
  overlay.className = "add-child-overlay";
  overlay.hidden = true;
  overlay.dataset.mode = "create";

  overlay.innerHTML = `
    <div class="add-child-backdrop" data-close-overlay="true"></div>
    <section class="add-child-modal" aria-label="Add or edit child">
      <div class="add-child-modal-head">
        <h2 class="add-child-modal-title">Add Child</h2>
        <button type="button" class="add-child-close" data-close-overlay="true" aria-label="Close">×</button>
      </div>

      <div class="add-image-card">
        <div class="add-image-icon-wrap">
          <img src="${ASSETS.inactiveChildPhoto}" alt="Child preview" class="child-image-preview" />
        </div>
        <input class="child-image-input" type="file" accept="image/*" hidden />
        <button type="button" class="add-image-action">+ Add image from Gallery</button>
      </div>

      <label class="child-name-field">
        <span>Child's Name</span>
        <input data-child-name type="text" placeholder="Child's Name" />
      </label>

      <h3 class="age-title">Select Age</h3>
      <div class="age-wheel-shell">
        <div class="age-wheel-fade age-wheel-fade--top"></div>
        <ul class="age-wheel" aria-label="Age selection"></ul>
        <div class="age-wheel-fade age-wheel-fade--bottom"></div>
      </div>

      <label class="child-name-field child-notes-field">
        <span>Profile note</span>
        <textarea data-child-notes placeholder="Allergies, comfort tips, or anything useful"></textarea>
      </label>

      <button type="button" class="save-child-button">Save</button>
    </section>
  `;

  const wheel = overlay.querySelector(".age-wheel");
  const imageInput = overlay.querySelector(".child-image-input");
  const imageButton = overlay.querySelector(".add-image-action");
  const imagePreview = overlay.querySelector(".child-image-preview");
  const title = overlay.querySelector(".add-child-modal-title");
  const nameInput = overlay.querySelector("[data-child-name]");
  const notesInput = overlay.querySelector("[data-child-notes]");

  createAgeWheelItems(wheel);
  scrollAgeIntoView(wheel, 4);

  let scrollTimer = null;
  wheel.addEventListener("scroll", () => {
    updateAgeSelection(wheel);
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const selected = wheel.querySelector(".age-wheel-item.is-selected");
      selected?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
  });

  imageButton.addEventListener("click", () => imageInput.click());
  imagePreview.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      overlay.dataset.photoUrl = String(reader.result || "");
      imagePreview.src = overlay.dataset.photoUrl;
    };
    reader.readAsDataURL(file);
  });

  overlay.resetForm = (child = null) => {
    overlay.dataset.mode = child ? "edit" : "create";
    overlay.dataset.editChildId = child?.id || "";
    overlay.dataset.photoUrl = child?.photo_url || "";
    title.textContent = child ? "Edit Child" : "Add Child";
    nameInput.value = child?.name || "";
    notesInput.value = child?.notes || "";
    imagePreview.src = child?.photo_url || ASSETS.inactiveChildPhoto;
    imageInput.value = "";
    scrollAgeIntoView(wheel, child?.age || 4);
  };

  overlay.querySelectorAll('[data-close-overlay="true"]').forEach((node) => {
    node.addEventListener("click", () => { overlay.hidden = true; });
  });

  overlay.querySelector(".save-child-button")?.addEventListener("click", () => {
    const selectedAge = Number(wheel.querySelector(".age-wheel-item.is-selected")?.dataset.age || "4");
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      nameInput.classList.add("field-error");
      setTimeout(() => nameInput.classList.remove("field-error"), 800);
      return;
    }

    const child = {
      id: overlay.dataset.editChildId || undefined,
      name,
      age: selectedAge,
      photo_url: overlay.dataset.photoUrl || ASSETS.inactiveChildPhoto,
      notes: notesInput.value.trim(),
    };

    onSave?.(child);
    overlay.hidden = true;
  });

  overlay.resetForm();
  return overlay;
}
