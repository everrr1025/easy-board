import { getApps, createAppsView } from "./app/apps.js";
import navigator from "./app/navigator/navigator.js";
import content from "./app/content/content.js";

function init() {
  document.getElementById("container").append(navigator.create());
  document.getElementById("container").append(content.create());
}

init();
