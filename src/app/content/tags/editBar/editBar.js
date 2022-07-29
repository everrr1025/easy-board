import { styleHyphenFormat } from "../../../utils/utils.js";
import { getColorSettings } from "../../../utils/workspace.js";
import { getState1, setState1, register } from "../../../../state.js";

/**
 * edit bar for tags
 */

const TOOLS = ["add", "edit", "delete"];
const ID = "tag-edit-bar";
const COLORSETTINGS = await getColorSettings();
const VIEW_STYLE = {
  display: "flex",
  marginTop: "2rem",
};
const TOOL_STYLE = {
  padding: "0.5rem",
  cursor: "pointer",
  border: `1px solid ${COLORSETTINGS.primaryColor}`,
  marginRight: "0.3rem",
};

const TOOL_STYLE_ACTIVE = {
  padding: "0.5rem",
  cursor: "pointer",
  border: `1px solid ${COLORSETTINGS.primaryColor}`,
  marginRight: "0.3rem",
  backgroundColor: getColorSettings().primaryColor,
  color: "white",
};

//actions
const onAddClick = (e, popupOn) => {
  setState1("tags.editBar.add.active", !popupOn);
  setState1("tags.editBar.current", popupOn ? null : "add");
};

const onDeleteClick = (e, deleteOn) => {
  setState1("tags.editBar.delete.active", !deleteOn);
  setState1("tags.editBar.current", deleteOn ? null : "delete");
};

const onEditClick = (e, editOn) => {
  setState1("tags.editBar.edit.active", !editOn);
  setState1("tags.editBar.current", editOn ? null : "edit");
};

const update = () => {
  if (document.getElementById(ID)) {
    document.getElementById(ID).innerHTML = "";
  }
  create();
};

const create = () => {
  let view;
  const primaryColor = getState1("workspace.primaryColor");
  if (!(view = document.getElementById(ID))) {
    view = document.createElement("div");
    view.id = ID;
  }
  TOOLS.forEach((tool) => {
    const toolView = document.createElement("div");
    toolView.innerText = tool;
    tool == "add" &&
      !getState1("tags.editBar.current") &&
      toolView.addEventListener("click", (e) => {
        onAddClick(e, getState1("tags.editBar.add.active"));
      });

    tool == "delete" &&
      toolView.addEventListener("click", (e) => {
        if (!["delete", null].includes(getState1("tags.editBar.current")))
          return;
        onDeleteClick(e, getState1("tags.editBar.delete.active"));
      });
    tool == "edit" &&
      toolView.addEventListener("click", (e) => {
        if (!["edit", null].includes(getState1("tags.editBar.current"))) return;
        onEditClick(e, getState1("tags.editBar.edit.active"));
      });

    const current = getState1("tags.editBar.current");

    Object.assign(
      toolView.style,
      styleHyphenFormat(
        !current || current != tool
          ? Object.assign(TOOL_STYLE, { borderColor: primaryColor })
          : Object.assign(TOOL_STYLE_ACTIVE, {
              borderColor: primaryColor,
              backgroundColor: primaryColor,
            })
      )
    );

    view.append(toolView);
  });

  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};
register("tags.editBar.current", update);
const editBar = { create };
export default editBar;
