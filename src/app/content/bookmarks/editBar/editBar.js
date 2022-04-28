import { getState, setState1, register } from "../../../../state.js";
import { styleHyphenFormat } from "../../../utils/utils.js";
import add from "../editBar/add.js";
/**
 * edit bar
 */
const TOOLS = ["add"];

const VIEW_STYLE = {
  display: "flex",
  marginTop: "2rem",
};
const TOOL_STYLE = {
  padding: "0.3rem",
  cursor: "pointer",
  border: "1px solid black",
};

//actions
const onAddClick = (e, popupOn) => {
  setState1("bookmarks.editBar.add", { active: !popupOn });
};

const createEditTool = () => {
  let view;

  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

const POPUP_STYLE = {
  display: "block",
};
const POPUP_STYLE_HIDE = {
  display: "none",
};
const popup = (display) => {
  let view = document.createElement("div");
  view.append(add.create());
  Object.assign(
    view.style,
    styleHyphenFormat(display ? POPUP_STYLE : POPUP_STYLE_HIDE)
  );
  return view;
};
const update = () => {
  if (document.getElementById("edit-bar")) {
    document.getElementById("edit-bar").innerText = "";
  }
  create();
};
const create = () => {
  let view;
  let bkStates = getState("bookmarks");

  if (!document.getElementById("edit-bar")) {
    view = document.createElement("div");
    view.id = "edit-bar";
  } else {
    view = document.getElementById("edit-bar");
  }
  TOOLS.forEach((tool) => {
    let toolView = document.createElement("div");
    toolView.innerText = tool;
    toolView.addEventListener("click", (e) => {
      onAddClick(e, bkStates.editBar.add.active);
    });
    Object.assign(toolView.style, styleHyphenFormat(TOOL_STYLE));
    view.append(toolView);
  });
  view.append(popup(bkStates.editBar.add.active));
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

register("bookmarks.editBar.add", update);
const editBar = { create };
export default editBar;
