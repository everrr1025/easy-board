import { getApps, createAppsView } from "./app/apps.js";
import navigator from "./app/navigator/navigator.js";
import content from "./app/content/content.js";
import { getState } from "./state.js";
import { toPath } from "../test.js";

async function init() {
  document.getElementById("container").append(navigator.create());
  document.getElementById("container").append(await content.create());
}

await init();
