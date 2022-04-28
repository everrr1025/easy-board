import {
  getState,
  getState1,
  setState,
  register,
  setState1,
} from "../../../state.js";
import { getBookmarks, compareNodes } from "../../utils/chrome.js";
import { styleHyphenFormat, getChildren } from "../../utils/utils.js";
import breadcrumb from "./breadcrumb.js";
import editBar from "./editBar/editBar.js";

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

const onClickBookmark = (event, bookmark) => {
  if (bookmark.url) {
    window.open(bookmark.url, "_blank");
  } else {
    let currentPath = getState1("bookmarks.path");
    currentPath.push(bookmark);
    // setState("bookmarks", {
    //   ...getState("bookmarks"),
    //   isSelected: bookmark.id,
    //   path: x,
    // });

    setState1("bookmarks.isSelected", bookmark.id);
    setState1("bookmarks.path", currentPath);
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
  let view;
  let bkView = document.createElement("div");
  if (document.getElementById("bookmarks"))
    view = document.getElementById("bookmarks");
  else {
    view = document.createElement("div");
    view.id = "bookmarks";
  }

  let nodes;

  if (isSelected) {
    // nodes = getChildren(getState1("bookmarks.bks"), isSelected).sort(
    //   compareNodes
    // );

    const bks = getState1("bookmarks.bks");
    nodes = getChildren(bks, isSelected).children.sort(compareNodes);
    console.log(nodes);
    // nodes = getState1("bookmarks.bks").children.sort(compareNodes);
  } else {
    nodes = getState1("bookmarks.bks").children.sort(compareNodes);
    setState("bookmarks", { ...getState("bookmarks"), isSelected: bkNodes.id });
  }

  nodes.forEach((node) => {
    const bookmarkDiv = document.createElement("div");
    bookmarkDiv.innerText = node.title;
    const isFolder = !node.url ? true : false;
    bookmarkDiv.addEventListener("click", (e) => {
      onClickBookmark(e, node);
    });
    Object.assign(
      bookmarkDiv.style,
      isFolder
        ? styleHyphenFormat(FOLDER_STYLE)
        : styleHyphenFormat(BOOKMARK_STYLE)
    );

    bkView.append(bookmarkDiv);
  });
  Object.assign(bkView.style, styleHyphenFormat(BOOKMARK_VIEW_STYLE));

  view.append(breadcrumb.create());
  view.append(bkView);
  view.append(editBar.create());
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
}

let bkNodes = await getBookmarks();
setState("bookmarks", {
  ...getState("bookmarks"),
  bks: bkNodes,
  path: [bkNodes],
});
register("bookmarks.bks", update);
register("bookmarks.isSelected", update);
const bookmarks = { update, create };
export default bookmarks;
