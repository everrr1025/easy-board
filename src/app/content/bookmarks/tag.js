import { styleHyphenFormat } from "../../utils/utils.js";
import { register, getState1 } from "../../../state.js";

const STYLE = {
  marginTop: "1rem",
  display: "flex;",
};

const TAG_STYLE = {
  border: "1px solid red",
  padding: "5px",
  margin: "10px 10px 0 0",
  display: "inline-block",
};

const update = () => {
  if (document.getElementById("tab-bar")) {
    document.getElementById("tab-bar").innerHTML = "";
  }
  create();
};
const create = () => {
  const tags = getState1("bookmarks.editBar.tags");

  let tagBar;
  const TAG_BAR_ID = "tab-bar";
  if (!(tagBar = document.getElementById(TAG_BAR_ID))) {
    tagBar = document.createElement("div");
    tagBar.id = TAG_BAR_ID;
  } else {
    tagBar.innerHTML = "";
  }

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const tagLabel = document.createElement("label");
      tagLabel.append(document.createTextNode(tag.title));
      Object.assign(tagLabel.style, styleHyphenFormat(TAG_STYLE));
      tagBar.append(tagLabel);
    }
  }
  Object.assign(tagBar.style, styleHyphenFormat(STYLE));
  return tagBar;
};

register("bookmarks.editBar.tags", update);
const tag = { create };

export default tag;
