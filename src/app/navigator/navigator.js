import { getState1, register, setState1 } from "../../state.js";
import { styleHyphenFormat } from "../utils/utils.js";
import { getUserData } from "../utils/chrome.js";

/**
 * navigator component
 */

const NAVIGATOR = "navigation";
const TABS_CATEGORY = ["bookmarks", "tags"];

//navi style
const NAVI_STYLE = {
  display: "flex",
};
//tabs style
const TAB_STYLE = {
  width: "5rem",
  textAlign: "center",
  backgroundColor: "#fff",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 0 0",
  cursor: "pointer",
};
const TAB_STYLE_SELECTED = {
  width: "5rem",
  textAlign: "center",
  backgroundColor: "#000",
  color: "#fff",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 0 0",
  cursor: "pointer",
};

//actions
async function onTabClick(event, tab) {
  if (tab === "tags") {
    const storage = await getUserData(["tags"]);
    setState1("tags.tags", new Map(JSON.parse(storage.tags)));
  }
  setState1("navigator.isSelected", tab);
}

const updateView = () => {
  document.getElementById("navigator").innerHTML = "";
  create();
};

const create = () => {
  let view;
  if (document.getElementById("navigator"))
    view = document.getElementById("navigator");
  else {
    view = document.createElement("div");
    view.id = "navigator";
  }

  TABS_CATEGORY.forEach((category) => {
    const isSelected = getState1("navigator.isSelected"); //upadte state
    const naviTab = document.createElement("div");
    naviTab.dataset.category = category;
    naviTab.innerText = category;
    naviTab.addEventListener(
      "click",
      async (e) => await onTabClick(e, naviTab.dataset.category)
    );

    Object.assign(
      naviTab.style,
      isSelected === category
        ? styleHyphenFormat(TAB_STYLE_SELECTED)
        : styleHyphenFormat(TAB_STYLE)
    );
    view.append(naviTab);
  });
  Object.assign(view.style, styleHyphenFormat(NAVI_STYLE));
  return view;
};

register("navigator.isSelected", updateView);
const navigator = {
  create,
};

export default navigator;
