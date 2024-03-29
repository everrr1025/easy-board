import { getState1, setState1, register } from "../../../../state.js";
import { getColorSettings } from "../../../utils/workspace.js";
import { styleHyphenFormat } from "../../../utils/utils.js";
/**
 * edit bar
 */
const TOOLS = ["add", "edit", "delete"];
//const COLORSETTINGS = await getColorSettings();
const VIEW_STYLE = {
  display: "flex",
  marginTop: "2rem",
};
const TOOL_STYLE = {
  padding: "0.5rem",
  cursor: "pointer",
  marginRight: "0.3rem",
};

const TOOL_STYLE_ACTIVE = {
  padding: "0.5rem",
  cursor: "pointer",
  marginRight: "0.3rem",

  color: "white",
};
//actions
const onAddClick = (e, popupOn) => {
  setState1("bookmarks.editBar.add.active", !popupOn);
  setState1("bookmarks.editBar.current", popupOn ? null : "add");
};
const onEditClick = (e, editOn) => {
  setState1("bookmarks.editBar.edit.active", !editOn);
  setState1("bookmarks.editBar.current", editOn ? null : "edit");
};
const onDeleteClick = (e, deleteOn) => {
  setState1("bookmarks.editBar.delete.active", !deleteOn);
  setState1("bookmarks.editBar.current", deleteOn ? null : "delete");
};
const createEditTool = () => {
  let view;

  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
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
  const primaryColor = getState1("workspace.primaryColor");

  if (!document.getElementById("edit-bar")) {
    view = document.createElement("div");
    view.id = "edit-bar";
  } else {
    view = document.getElementById("edit-bar");
  }
  TOOLS.forEach((tool) => {
    let toolView = document.createElement("div");
    toolView.innerText = tool;

    tool == "add" &&
      !getState1("bookmarks.editBar.current") &&
      toolView.addEventListener("click", (e) => {
        onAddClick(e, getState1("bookmarks.editBar.add.active"));
      });
    tool == "edit" &&
      toolView.addEventListener("click", (e) => {
        if (!["edit", null].includes(getState1("bookmarks.editBar.current")))
          return;
        onEditClick(e, getState1("bookmarks.editBar.edit.active"));
      });
    tool == "delete" &&
      toolView.addEventListener("click", (e) => {
        if (!["delete", null].includes(getState1("bookmarks.editBar.current")))
          return;
        onDeleteClick(e, getState1("bookmarks.editBar.delete.active"));
      });

    const current = getState1("bookmarks.editBar.current");

    Object.assign(
      toolView.style,
      styleHyphenFormat(
        !current || current != tool
          ? Object.assign(TOOL_STYLE, { border: `1px solid ${primaryColor}` })
          : Object.assign(TOOL_STYLE_ACTIVE, {
              border: `1px solid ${primaryColor}`,
              backgroundColor: primaryColor,
            })
      )
    );

    view.append(toolView);
  });

  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

register("bookmarks.editBar.add", update);
register("bookmarks.editBar.current", update);
const editBar = { create };
export default editBar;
