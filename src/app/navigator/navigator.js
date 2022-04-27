import { getState, setState, registerListener } from "../../state.js";
import { styleHyphenFormat } from "../utils/utils.js";
import content from "../content/content.js";

/**
 * navigator component
 */

const NAVIGATOR = "navigation";
const TABS_CATEGORY = ["bookmarks", "tabs", "notes"];

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
const onTabClick = (event, tab) => {
  setState("navigator", { isSelected: tab }); //upadte state
};

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
    const isSelected = getState("navigator").isSelected; //upadte state
    const naviTab = document.createElement("div");
    naviTab.dataset.category = category;
    naviTab.innerText = category;
    naviTab.addEventListener("click", (e) =>
      onTabClick(e, naviTab.dataset.category)
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

registerListener("navigator", updateView);
const navigator = {
  create,
};

export default navigator;
