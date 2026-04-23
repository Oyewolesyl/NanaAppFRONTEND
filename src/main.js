import "./styles.css";
import { renderGetStartedScreen }        from "./screens/getStartedScreen";
import { renderSelectRoleScreen }         from "./screens/selectRoleScreen";
import { renderHomepageNewUserScreen }    from "./screens/homepageNewUserScreen";
import { renderChildAddedScreen }         from "./screens/childAddedScreen";
import { renderSecondChildAddedScreen }   from "./screens/secondChildAddedScreen";
import { renderShowPainScreen }           from "./screens/ShowpainScreen";
import { renderPainTypeScreen }           from "./screens/Paintypescreen";
import { renderWhenDidItStartScreen }     from "./screens/WhenDidItStartScreen";
import { renderPainScaleScreen }          from "./screens/Painscalescreen";

let previousHash = "#get-started";

function renderApp() {
  const app = document.querySelector("#app");
  if (!app) return;
  const route = window.location.hash || "#get-started";

  if (route === "#select-role") {
    renderSelectRoleScreen(app);
    return;
  }
  if (route === "#homepage-newuser") {
    renderHomepageNewUserScreen(app);
    return;
  }
  if (route === "#child-added") {
    renderChildAddedScreen(app);
    return;
  }
  if (route === "#second-child-added") {
    renderSecondChildAddedScreen(app);
    return;
  }
  if (route === "#body-map") {
    const from = ["#child-added", "#second-child-added"].includes(previousHash)
      ? previousHash : "#child-added";
    renderShowPainScreen(app, { fromScreen: from });
    return;
  }
  if (route === "#pain-type") {
    renderPainTypeScreen(app, { fromScreen: "#body-map" });
    return;
  }
  if (route === "#when-did-it-start") {
    renderWhenDidItStartScreen(app, { fromScreen: "#pain-type" });
    return;
  }
  if (route === "#pain-scale") {
    renderPainScaleScreen(app, { fromScreen: "#when-did-it-start" });
    return;
  }
  renderGetStartedScreen(app);
}

window.addEventListener("hashchange", (e) => {
  previousHash = new URL(e.oldURL).hash || "#get-started";
  renderApp();
});

if (!window.location.hash) window.location.hash = "#get-started";
renderApp();