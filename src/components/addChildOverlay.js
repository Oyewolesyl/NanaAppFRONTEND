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

function scrollToAge(wheel, age) {
  const item = wheel.querySelector(`.age-wheel-item[data-age="${age}"]`);
  if (!item) return;
  setTimeout(() => {
    item.scrollIntoView({ block: "center" });
    updateAgeSelection(wheel);
  }, 0);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function createAddChildOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "add-child-overlay";
  overlay.hidden = true;
  overlay.dataset.mode = "add";

  overlay.innerHTML = `
    <div class="add-child-backdrop" data-close-overlay="true"></div>
    <section class="add-child-modal" aria-label="Add or edit child">
      <div class="add-image-card">
        <div class="add-image-icon-wrap">
          <img class="add-child-photo-preview" src="${ASSETS.inactiveChildPhoto}" alt="Child preview" />
          <input class="add-child-file-input" type="file" accept="image/*" hidden />
        </div>
        <button type="button" class="add-image-action">+ Add image from Gallery</button>
      </div>
      <label class="child-name-field">
        <input type="text" data-child-name placeholder="Child's Name" />
      </label>
      <h3 class="age-title">Select Age</h3>
      <div class="age-wheel-shell">
        <div class="age-wheel-fade age-wheel-fade--top"></div>
        <ul class="age-wheel" aria-label="Age selection"></ul>
        <div class="age-wheel-fade age-wheel-fade--bottom"></div>
      </div>
      <div class="edit-profile-extra-fields">
        <label class="settings-field settings-field--mini">Notes<input type="text" data-child-notes placeholder="Optional notes" /></label>
      </div>
      <button type="button" class="save-child-button">Save</button>
    </section>
  `;

  const wheel = overlay.querySelector(".age-wheel");
  const nameInput = overlay.querySelector("[data-child-name]");
  const notesInput = overlay.querySelector("[data-child-notes]");
  const fileInput = overlay.querySelector(".add-child-file-input");
  const preview = overlay.querySelector(".add-child-photo-preview");
  const imageButton = overlay.querySelector(".add-image-action");

  createAgeWheelItems(wheel);
  scrollToAge(wheel, 4);

  let scrollTimer = null;
  wheel.addEventListener("scroll", () => {
    updateAgeSelection(wheel);
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const selected = wheel.querySelector(".age-wheel-item.is-selected");
      selected?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
  });

  imageButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    overlay.dataset.photoUrl = dataUrl;
    preview.src = dataUrl;
  });

  overlay.resetForm = () => {
    overlay.dataset.mode = "add";
    overlay.dataset.editChildId = "";
    overlay.dataset.photoUrl = "";
    nameInput.value = "";
    notesInput.value = "";
    preview.src = ASSETS.inactiveChildPhoto;
    fileInput.value = "";
    scrollToAge(wheel, 4);
  };

  overlay.openForChild = (child) => {
    overlay.dataset.mode = "edit";
    overlay.dataset.editChildId = child.id;
    overlay.dataset.photoUrl = child.photo_url || "";
    nameInput.value = child.name || "";
    notesInput.value = child.notes || "";
    preview.src = child.photo_url || ASSETS.inactiveChildPhoto;
    fileInput.value = "";
    scrollToAge(wheel, Number(child.age || 4));
    overlay.hidden = false;
  };

  overlay.getFormData = () => {
    const selectedAge = Number(wheel.querySelector(".age-wheel-item.is-selected")?.dataset.age || "4");
    return {
      id: overlay.dataset.mode === "edit" ? overlay.dataset.editChildId : undefined,
      name: nameInput.value.trim(),
      age: selectedAge,
      photo_url: overlay.dataset.photoUrl || undefined,
      notes: notesInput.value.trim(),
    };
  };

  return overlay;
}
