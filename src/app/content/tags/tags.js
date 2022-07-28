import { setState1, getState1, register } from "../../../state.js";
import { styleHyphenFormat } from "../../utils/utils.js";
import { getBookmarksByID } from "../../utils/chrome.js";
import editBar from "./editBar/editBar.js";
import add from "../tags/editBar/add.js";
import del from "../tags/editBar/del.js";
import edit from "../tags/editBar/edit.js";
import bookmarksInTag from "./bookmarksInTag/bookmarksInTag.js";
const VIEW_STYLE = {
  display: "flex",
  flexDirection: "column",
};

const MSG_STYLE = {
  // border: "1px dashed black",

  padding: "1rem 0",
};
const TAGS_VIEW_STYLE = {
  display: "flex",
  flexWrap: "wrap",
};

const TAG_STYLE = {
  color: "red",
  backgroundColor: "white",
  cursor: "pointer",
  border: "1px solid red",
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
  minWidth: "1rem",
  maxWidth: "8rem",
  overflow: "hidden",
  textAlign: "center",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

async function onClickTag(event, item, current) {
  if (current === "delete") {
    setState1("tags.editBar.delete.deleting", item);
  } else if (current === "edit") {
    setState1("tags.editBar.edit.editing", item);
  } else {
    const bookmarksInTag = [];
    for (let id of item.bookmarks) {
      const x = await getBookmarksByID(id);
      bookmarksInTag.push(x[0]);
    }
    setState1("tags.bookmarksInTag.current", { ...item, bookmarksInTag });
    setState1("tags.bookmarksInTag.active", true);
  }
}

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

const update = () => {
  if (document.getElementById("tags")) {
    document.getElementById("tags").innerHTML = "";
    create();
  }
};
const create = () => {
  let view;
  let tags_view = document.createElement("div");

  if (document.getElementById("tags")) view = document.getElementById("tags");
  else {
    view = document.createElement("div");
    view.id = "tags";
  }
  const tagsMap = getState1("tags");

  const xx = [...tagsMap.tags].sort((a, b) => {
    return b[1].bookmarks.length - a[1].bookmarks.length;
  });

  if (xx.length != 0) {
    const mapAsc = new Map(xx);

    mapAsc.forEach((item) => {
      let tag = createTagsLabel(item);
      Object.assign(tag.style, styleHyphenFormat(TAG_STYLE));

      tag.addEventListener("click", async (e) => {
        await onClickTag(e, item, getState1("tags.editBar.current"));
      });
      if (
        getState1("tags.editBar.delete.active") ||
        getState1("tags.editBar.edit.active")
      ) {
        tag.style.border = "1px dashed red";
      }
      tags_view.append(tag);
    });
  } else {
    const msg = document.createElement("div");
    msg.innerText = "click 'add' button to create tag";
    Object.assign(msg.style, styleHyphenFormat(MSG_STYLE));
    view.append(msg);
  }
  Object.assign(tags_view.style, styleHyphenFormat(TAGS_VIEW_STYLE));
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  view.append(tags_view);
  view.append(bookmarksInTag.create());
  view.append(add.create());
  view.append(del.create());
  view.append(edit.create());
  view.append(editBar.create());
  return view;
};

register("tags.tags", update);
register("tags.editBar.delete.active", update);
register("tags.editBar.edit.active", update);
register("tags.bookmarksInTag.active", update);
const tags = { create };
export default tags;
