import { styleHyphenFormat } from "../../../utils/utils.js";
import { createBookmark } from "../../../utils/chrome.js";
import { getState1, setState1, bookmarkAdded } from "../../../../state.js";
/**
 * add component in edit bar
 */

//action
const addBookmark = (details) => {
  createBookmark(details).then((x) => {
    bookmarkAdded();
    setState1("bookmarks.editBar.add", { active: false });
  });
};
const VIEW_STYLE = {
  display: "block",
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 1,
  position: "fixed",
  left: 0,
  top: 0,
};

const CONTENT_VIEW_STYLE = {
  display: "flex",
  flexDirection: "column",
  width: "50%",
  margin: "10% auto auto",
  border: "1px solid black",
  backgroundColor: "white",
  padding: "1.5rem",
};

const HEAD_STYLE = {
  backgroundColor: "white",
  marginBottom: "0.5rem",
  height: "20%",
  fontSize: "14px",
};
const BODY_STYLE = {
  display: "flex",
  flexDirection: "column",
  height: "60%",
};
const FOOT_STYLE = {
  display: "flex",
  marginTop: "0.5rem",
};

const INPUT_DIV_STYLE = {
  display: "flex",
  flexDirection: "column",
  margin: "0.5rem 0",
};

const INPUT_STYLE = {
  marginTop: "0.25rem",
  boxSizing: "content-box",
  height: "1.5rem",
};
const BUTTON_STYLE = {
  padding: "0.25rem",

  backgroundColor: "white",
  border: "1px solid black",
};
const content = () => {
  let view = document.createElement("div");
  view.id = "modal-content";
  //header
  let head = document.createElement("div");
  head.innerText = "Add Bookmark";
  //body
  let body = document.createElement("div");
  let urlDiv = document.createElement("div");
  let urlLabel = document.createElement("label");
  urlLabel.innerText = "URL";
  let urlInput = document.createElement("input");
  Object.assign(urlInput.style, styleHyphenFormat(INPUT_STYLE));
  urlInput.id = "add-bk-url";
  urlInput.value = "https://";
  urlDiv.append(urlLabel);
  urlDiv.append(urlInput);

  let titleDiv = document.createElement("div");
  let titleLabel = document.createElement("label");
  titleLabel.innerText = "Bookmark Name";
  let titleInput = document.createElement("input");
  Object.assign(titleInput.style, styleHyphenFormat(INPUT_STYLE));
  titleInput.id = "add-bk-title";
  titleDiv.append(titleLabel);
  titleDiv.append(titleInput);

  //let title = document.createElement("input");
  body.append(urlDiv);
  body.append(titleDiv);

  //foot
  let foot = document.createElement("div");
  let addButton = document.createElement("div");
  addButton.innerText = "add";
  foot.append(addButton);
  addButton.addEventListener("click", () => {
    addBookmark({
      url: urlInput.value,
      title: titleInput.value,
      parentId: getState1("bookmarks.isSelected"),
    });
  });
  Object.assign(addButton.style, styleHyphenFormat(BUTTON_STYLE));
  Object.assign(head.style, styleHyphenFormat(HEAD_STYLE));
  Object.assign(body.style, styleHyphenFormat(BODY_STYLE));
  Object.assign(foot.style, styleHyphenFormat(FOOT_STYLE));
  Object.assign(urlDiv.style, styleHyphenFormat(INPUT_DIV_STYLE));
  Object.assign(titleDiv.style, styleHyphenFormat(INPUT_DIV_STYLE));
  view.append(head);
  view.append(body);
  view.append(foot);
  Object.assign(view.style, styleHyphenFormat(CONTENT_VIEW_STYLE));
  return view;
};

//action
//const createBookmark = () => {};
const closeModal = (e) => {
  if (e.target.id == "modal")
    setState1("bookmarks.editBar.add", { active: false });
  setState1("bookmarks.editBar.current", null);
};
const update = () => {
  create();
};

const create = () => {
  let view = document.createElement("div");
  view.id = "modal";
  view.addEventListener("click", (e) => {
    closeModal(e);
  });

  view.append(content());

  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

const add = { create };

export default add;
