import { getState1, register, setState1 } from "../../../state.js";
import { getBookmarks, compareNodes } from "../../utils/chrome.js";
import { styleHyphenFormat, getChildren } from "../../utils/utils.js";
import breadcrumb from "./breadcrumb.js";
import editBar from "./editBar/editBar.js";
import edit from "../bookmarks/editBar/edit.js";
import del from "../bookmarks/editBar/del.js";

/*
 * component bookmarks
 */
const VIEW_STYLE = {
  display: "flex",
  flexDirection: "column",
};

const BOOKMARK_VIEW_STYLE = {
  display: "flex",
  flexWrap: "wrap",
  marginTop: "1rem",
};

const FOLDER_STYLE = {
  backgroundColor: "#ddd",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
  cursor: "pointer",
};

const BOOKMARK_STYLE = {
  backgroundColor: "white",
  cursor: "pointer",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
};

//actions

const onClickBookmark = (event, bookmark, current) => {
  if (current == null) {
    if (bookmark.url) {
      window.open(bookmark.url, "_blank");
    } else {
      let currentPath = getState1("bookmarks.path");
      currentPath.push(bookmark);
      setState1("bookmarks.isSelected", bookmark.id);
      setState1("bookmarks.path", currentPath);
    }
    return;
  }
  if (current == "edit") {
    setState1("bookmarks.editBar.edit.editing", bookmark);
  } else if (current === "delete") {
    setState1("bookmarks.editBar.delete.deleting", bookmark);
  }
};
const update = () => {
  if (document.getElementById("bookmarks")) {
    document.getElementById("bookmarks").innerHTML = "";
    create();
  }
};

function create() {
  const isSelected = getState1("bookmarks.isSelected");
  const deleting = getState1("bookmarks.editBar.delete.deleting");
  let view;
  let bkView = document.createElement("div");
  if (document.getElementById("bookmarks"))
    view = document.getElementById("bookmarks");
  else {
    view = document.createElement("div");
    view.id = "bookmarks";
  }

  let nodes;

  const bks = getState1("bookmarks.bks");

  const children = getChildren(bks, isSelected);
  if (isSelected && children && children.length > 0) {
    nodes = bks.children.sort(compareNodes);
  } else {
    nodes = children.children.sort(compareNodes);
  }

  nodes.forEach((node) => {
    const bookmarkDiv = document.createElement("div");
    bookmarkDiv.innerText = node.title;
    const isFolder = !node.url ? true : false;
    bookmarkDiv.addEventListener("click", (e) => {
      onClickBookmark(e, node, getState1("bookmarks.editBar.current"));
    });
    Object.assign(
      bookmarkDiv.style,
      isFolder
        ? styleHyphenFormat(FOLDER_STYLE)
        : styleHyphenFormat(BOOKMARK_STYLE)
    );

    if (
      getState1("bookmarks.editBar.edit.active") ||
      getState1("bookmarks.editBar.delete.active")
    ) {
      bookmarkDiv.style.border = "1px dashed red";
    }

    bkView.append(bookmarkDiv);
  });
  Object.assign(bkView.style, styleHyphenFormat(BOOKMARK_VIEW_STYLE));

  view.append(breadcrumb.create());
  view.append(bkView);
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
