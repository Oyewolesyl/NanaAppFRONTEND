import { ASSETS } from "../assets";

export function createStatusBar() {
  const bar = document.createElement("div");
  bar.className = "status-bar";
  bar.setAttribute("aria-hidden", "true");

  bar.innerHTML = `
    <img class="status-notch" src="${ASSETS.statusNotch}" alt="" />
    <div class="status-time">9:41</div>
    <img class="status-right" src="${ASSETS.statusRightSide}" alt="" />
  `;

  return bar;
}
