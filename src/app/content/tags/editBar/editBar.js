import { styleHyphenFormat } from "../../../utils/utils.js";
import { getState1, setState1 } from "../../../../state.js";

/**
 * edit bar for tags
 */

const TOOLS = ["add"];
const ID = "tag-edit-bar";

const VIEW_STYLE = {
  display: "flex",
  marginTop: "2rem",
};
const TOOL_STYLE = {
  padding: "0.3rem",
  cursor: "pointer",
  border: "1px solid black",
  marginRight: "0.3rem",
};

const TOOL_STYLE_ACTIVE = {
  padding: "0.3rem",
  cursor: "pointer",
  border: "1px solid black",
  marginRight: "0.3rem",
  backgroundColor: "black",
  color: "white",
};

//actions
const onAddClick = (e, popupOn) => {
  setState1("tags.editBar.add.active", !popupOn);
  setState1("tags.editBar.current", popupOn ? null : "add");
};

const create = () => {
  let view;
  view = document.createElement("div");
  view.id = ID;

  TOOLS.forEach((tool) => {
    const toolView = document.createElement("div");
    toolView.innerText = tool;
    tool == "add" &&
      !getState1("tags.editBar.current") &&
      toolView.addEventListener("click", (e) => {
        onAddClick(e, getState1("tags.editBar.add.active"));
      });
    Object.assign(toolView.style, styleHyphenFormat(TOOL_STYLE));
    view.append(toolView);
  });

  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

const editBar = { create };
export default editBar;
