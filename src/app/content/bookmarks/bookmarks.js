import { getState, setState, registerListener } from "../../../state.js";
import {
  getBookmarks,
  getBookmarksByID,
  compareNodes,
} from "../../utils/chrome.js";
import { styleHyphenFormat } from "../../utils/utils.js";
import breadcrumb from "./breadcrumb.js";

/*
 * component bookmarks
 */
const VIEW_STYLE = {
  display: "flex",
  flexDirection: "column",
};

const BOOKMARK_VIEW_STYLE = {
  display: "flex",
  marginTop: "1rem",
};

const FOLDER_STYLE = {
  backgroundColor: "#ddd",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 0 0 ",
  cursor: "pointer",
};

const BOOKMARK_STYLE = {
  backgroundColor: "white",
  cursor: "pointer",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 0 0 ",
};

//actions

const onClickBookmark = (event, bookmark) => {
  if (bookmark.url) {
    window.open(bookmark.url, "_blank");
  } else {
    let x = getState("bookmarks").path;
    x.push(bookmark);
    setState("bookmarks", {
      ...getState("bookmarks"),
      isSelected: bookmark,
      path: x,
    });
  }
};
const update = () => {
  if (document.getElementById("bookmarks")) {
    document.getElementById("bookmarks").innerHTML = "";
    create();
  }
};

async function create() {
  const isSelected = getState("bookmarks").isSelected;
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
    nodes = isSelected.children.sort(compareNodes);
  } else {
    nodes = bkNodes.children.sort(compareNodes);
    setState("bookmarks", { ...getState("bookmarks"), isSelected: bkNodes });
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

  view.append(await breadcrumb.create());
  view.append(bkView);
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
}

let bkNodes = await getBookmarks();
setState("bookmarks", {
  ...getState("bookmarks"),
  bks: bkNodes,
  path: [bkNodes],
});
registerListener("bookmarks", update);
const bookmarks = { update, create };
export default bookmarks;
