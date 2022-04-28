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
  width: "60%",
  height: "10rem",
  margin: "10% auto auto",
  border: "1px solid black",
  backgroundColor: "white",
  padding: "1rem",
};

const HEAD_STYLE = {
  backgroundColor: "gray",
  height: "20%",
};
const BODY_STYLE = { display: "flex", flexDirection: "column", height: "60%" };
const FOOT_STYLE = {
  height: "20%",
};

const INPUT_DIV_STYLE = {
  display: "flex",
  flexDirection: "column",
};
const BUTTON_STYLE = {
  width: "5rem",
  backgroundColor: "red",
};
const content = () => {
  let view = document.createElement("div");
  view.id = "modal-content";
  //header
  let head = document.createElement("div");
  head.innerText = "add bookmark";
  //body
  let body = document.createElement("div");
  let urlDiv = document.createElement("div");
  let urlLabel = document.createElement("label");
  urlLabel.innerText = "URL";
  let urlInput = document.createElement("input");
  urlInput.id = "add-bk-url";
  urlDiv.append(urlLabel);
  urlDiv.append(urlInput);

  let titleDiv = document.createElement("div");
  let titleLabel = document.createElement("label");
  titleLabel.innerText = "bookmark name";
  let titleInput = document.createElement("input");
  titleInput.id = "add-bk-title";
  titleDiv.append(titleLabel);
  titleDiv.append(titleInput);

  //let title = document.createElement("input");
  body.append(urlDiv);
  body.append(titleDiv);

  //foot
  let foot = document.createElement("div");
  let addButton = document.createElement("div");
  addButton.innerText = "fuck";
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
