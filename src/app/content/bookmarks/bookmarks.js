import { getState1, register, setState1 } from "../../../state.js";
import { compareNodes, openExtensionTab } from "../../utils/chrome.js";
import { styleHyphenFormat, getChildren } from "../../utils/utils.js";

import { getTags } from "../../utils/tag.js";
import breadcrumb from "./breadcrumb.js";
import editBar from "./editBar/editBar.js";
import edit from "../bookmarks/editBar/edit.js";
import del from "../bookmarks/editBar/del.js";
import add from "../bookmarks/editBar/add.js";

/*
 * component bookmarks
 */
//const COLORSETTINGS = await getColorSettings();
const VIEW_STYLE = {
  display: "flex",
  flexDirection: "column",
};
const MSG_STYLE = {
  // border: "1px dashed black",

  padding: "1rem 0",
};
const BOOKMARK_VIEW_STYLE = {
  display: "flex",
  flexWrap: "wrap",
  marginTop: "1rem",
};

const FOLDER_STYLE = {
  backgroundColor: "#ddd",
  //border: `1px solid ${COLORSETTINGS.primaryColor}`,
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
  cursor: "pointer",
  minWidth: "1rem",
  maxWidth: "8rem",
  overflow: "hidden",
  textAlign: "center",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const BOOKMARK_STYLE = {
  backgroundColor: "white",
  cursor: "pointer",
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
  minWidth: "1rem",
  maxWidth: "8rem",
  overflow: "hidden",
  textAlign: "center",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

//actions

async function onClickBookmark(event, bookmark, current) {
  if (current == null) {
    if (bookmark.url) {
      if (bookmark.url.startsWith("chrome://")) openExtensionTab(bookmark.url);
      else window.open(bookmark.url, "_blank");
    } else {
      let currentPath = getState1("bookmarks.path");
      currentPath.push(bookmark);
      setState1("bookmarks.isSelected", bookmark.id);
      setState1("bookmarks.path", currentPath);
    }
    return;
  }
  if (current == "edit") {
    if (bookmark.url) {
      const tags = await getTags(bookmark.id);
      setState1("bookmarks.editBar.tags", tags);
    }
    setState1("bookmarks.editBar.edit.editing", bookmark);
  } else if (current === "delete") {
    setState1("bookmarks.editBar.delete.deleting", bookmark);
  }
}
const update = () => {
  if (document.getElementById("bookmarks")) {
    document.getElementById("bookmarks").innerHTML = "";
    create();
  }
};

function create() {
  const isSelected = getState1("bookmarks.isSelected");
  const primaryColor = getState1("workspace.primaryColor");
  let view;
  let bkView = document.createElement("div");
  if (document.getElementById("bookmarks"))
    view = document.getElementById("bookmarks");
  else {
    view = document.createElement("div");
    view.id = "bookmarks";
  }

  let nodes = [];

  const bks = getState1("bookmarks.bks");

  const children = getChildren(bks, isSelected);

  if (isSelected && children && children.length > 0) {
    nodes = bks.children.sort(compareNodes);
  } else if (children && children.children.length > 0) {
    nodes = children.children.sort(compareNodes);
  } else {
  }
  view.append(breadcrumb.create());
  if (nodes.length != 0) {
    nodes.forEach((node) => {
      const bookmarkDiv = document.createElement("div");
      bookmarkDiv.innerText = node.title;
      const isFolder = !node.url ? true : false;
      bookmarkDiv.addEventListener("click", async (e) => {
        onClickBookmark(e, node, getState1("bookmarks.editBar.current"));
      });
      Object.assign(
        bookmarkDiv.style,
        isFolder
          ? Object.assign(styleHyphenFormat(FOLDER_STYLE), {
              border: `1px solid ${primaryColor}`,
            })
          : Object.assign(styleHyphenFormat(BOOKMARK_STYLE), {
              border: `1px solid ${primaryColor}`,
            })
      );

      if (
        getState1("bookmarks.editBar.edit.active") ||
        getState1("bookmarks.editBar.delete.active")
      ) {
        bookmarkDiv.style.border = "1px dashed red";
      }

      bkView.append(bookmarkDiv);
      Object.assign(bkView.style, styleHyphenFormat(BOOKMARK_VIEW_STYLE));
      view.append(bkView);
    });
  } else {
    const msg = document.createElement("div");
    msg.innerText = "click 'add' button to create bookmark";
    Object.assign(msg.style, styleHyphenFormat(MSG_STYLE));
    view.append(msg);
  }

  view.append(add.create());
  view.append(edit.create());
  view.append(del.create());
  view.append(editBar.create());
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
}

register("bookmarks.bks", update);
register("bookmarks.isSelected", update);
register("bookmarks.editBar.edit.active", update);
register("bookmarks.editBar.delete.active", update);

const bookmarks = { update, create };
export default bookmarks;
