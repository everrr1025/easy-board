import { getState1, register, setState1 } from "../../state.js";
import { styleHyphenFormat } from "../utils/utils.js";
import { getUserData } from "../utils/chrome.js";
import { getColorSettings, updateSettings } from "../utils/workspace.js";

/**
 * navigator component
 */

let ID = "";
const TABS_CATEGORY = ["bookmarks", "tags"];

//navi style
const NAVI_STYLE = {
  display: "flex",
};

let COLORSETTING = await getColorSettings();
//tabs style
const TAB_STYLE = {
  width: "5rem",
  textAlign: "center",
  backgroundColor: "#fff",
  border: `1px solid ${COLORSETTING.primaryColor}`,
  padding: "0.5rem",
  margin: "0 1rem 0 0",
  cursor: "pointer",
};
const TAB_STYLE_SELECTED = {
  width: "5rem",
  textAlign: "center",
  backgroundColor: COLORSETTING.primaryColor,
  color: "#fff",
  border: `1px solid ${COLORSETTING.primaryColor}`,
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
  if (document.getElementById(ID)) {
    document.getElementById(ID).innerHTML = "";
  }
  create();
};

const create = () => {
  let view;
  const primaryColor = getState1("workspace.primaryColor");
  if (document.getElementById(ID)) view = document.getElementById(ID);
  else {
    view = document.createElement("div");
    ID = "navigator";
    view.id = "navigator";
  }

  TABS_CATEGORY.forEach((category) => {
    const isSelected = getState1("navigator.isSelected"); //upadte state
    const naviTab = document.createElement("div");
    naviTab.className = "eb-theme";
    naviTab.dataset.category = category;
    naviTab.innerText = category;
    naviTab.addEventListener(
      "click",
      async (e) => await onTabClick(e, naviTab.dataset.category)
    );

    Object.assign(
      naviTab.style,
      isSelected === category
        ? styleHyphenFormat(
            Object.assign(TAB_STYLE_SELECTED, {
              backgroundColor: primaryColor,
              border: `1px solid ${primaryColor}`,
            })
          )
        : styleHyphenFormat(
            Object.assign(TAB_STYLE, {
              border: `1px solid ${primaryColor}`,
            })
          )
    );
    view.append(naviTab);
  });
  Object.assign(view.style, styleHyphenFormat(NAVI_STYLE));
  return view;
};

register("navigator.isSelected", updateView);
register("workspace.primaryColor", updateView);
const navigator = {
  create,
};

export default navigator;
