import { getState1 } from "../../../state.js";
import { styleHyphenFormat } from "../../utils/utils.js";

const VIEW_STYLE = {
  display: "flex",
  flexDirection: "column",
};

const TAGS_VIEW_STYLE = {
  display: "flex",
  flexWrap: "wrap",
};

const TAG_STYLE = {
  backgroundColor: "white",
  cursor: "pointer",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
  minWidth: "1rem",
  maxWidth: "8rem",
  overflow: "hidden",
  textAlign: "center",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
const createTagsLabel = (tag) => {
  const tagWrapper = document.createElement("div");
  const title = document.createTextNode(tag.title + "\n");
  const bkNumber = document.createElement("label");
  bkNumber.innerText = tag.bookmarks.length;
  bkNumber.style.marginLeft = "0.5rem";

  tagWrapper.append(title);
  tagWrapper.append(bkNumber);
  return tagWrapper;
};
const create = () => {
  let view = document.createElement("div");
  let tags_view = document.createElement("div");
  const tagsMap = getState1("tags");

  const xx = [...tagsMap.tags].sort((a, b) => {
    return b[1].bookmarks.length - a[1].bookmarks.length;
  });
  const mapAsc = new Map(xx);

  mapAsc.forEach((e) => {
    let tag = createTagsLabel(e);
    Object.assign(tag.style, styleHyphenFormat(TAG_STYLE));
    tags_view.append(tag);
  });
  Object.assign(tags_view.style, styleHyphenFormat(TAGS_VIEW_STYLE));
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  view.append(tags_view);
  return view;
};

const tags = { create };
export default tags;
