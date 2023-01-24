import { getState1, register } from "../../state.js";
import { styleHyphenFormat } from "../utils/utils.js";
import bookmarks from "./bookmarks/bookmarks.js";
import tags from "./tags/tags.js";
import { ENV } from "../../constants.js";
/* content compoent
 *
 * view to hold the content of bookmarks,tabs,etc.
 */
const STYLE = {
  margin: "1rem 0 1rem 0",
  padding: "1rem",
};

const update = () => {
  if (document.getElementById("content")) {
    document.getElementById("content").innerHTML = "";
  }
  create();
};

function create() {
  const primaryColor = getState1("workspace.primaryColor");
  const isSelected = getState1("navigator.isSelected");
  let view;
  if (document.getElementById("content"))
    view = document.getElementById("content");
  else {
    view = document.createElement("div");
    view.id = "content";
  }

  if (isSelected === "bookmarks") {
    let xx = bookmarks.create();
    view.append(xx);
  } else if (isSelected === "tags") {
    let xx = tags.create();
    view.append(xx);
  }

  //------------------------------------
  if (ENV == "dev") {
    const VERSION_STYLE = {
      margin: "0 0 1rem 1.5rem",
      position: "absolute",
      left: 0,
      bottom: 0,
    };
    const version = document.createElement("div");
    version.innerText =
      "1.0.0-alpha.5 - 8c4d56cca00d46eef32057a314cc1321719472d9";
    Object.assign(version.style, VERSION_STYLE);
    view.append(version);
  }

  //------------------------------------
  Object.assign(
    view.style,
    Object.assign(styleHyphenFormat(STYLE), {
      border: `1px solid ${primaryColor}`,
    })
  );
  return view;
}

register("navigator.isSelected", update);
register("workspace.primaryColor", update);
const content = { create, update };

export default content;
