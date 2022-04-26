import { getBookmarks, createPagesView } from "./app/bookmarks.js";
import { getApps, createAppsView } from "./app/apps.js";

const CATEGORY = ["app-view", "note-view", "page-view"];

let selected = "page-view";

const toggleCategory = (category) => {
  CATEGORY.forEach((c) => {
    document.getElementById(c).style.display = c === category ? "flex" : "none";
  });
};

const toggleNavigator = (category) => {
  [...document.getElementById("navigation").children].forEach((bn) => {
    bn.className = bn.dataset.category === category ? "navi selected" : "navi";
  });
};

const init = () => {
  createPagesView(defaultBookmarks);
  createAppsView(defaultApps.content.apps);
  [...document.getElementById("navigation").children].forEach((bn) => {
    bn.addEventListener("click", (e) => {
      const category = bn.dataset.category;
      toggleCategory(category);
      toggleNavigator(bn.dataset.category);
    });
  });
};

let defaultBookmarks = await getBookmarks();
let defaultApps = await getApps();

init();
