import { styleHyphenFormat } from "../../../utils/utils.js";
import { createBookmark } from "../../../utils/chrome.js";
import {
  getState1,
  setState1,
  register,
  bookmarkAdded,
} from "../../../../state.js";

import { Modal, Input, Button } from "../../../component/index.js";
/**
 * add component in edit bar
 */

//action
const addBookmark = (details) => {
  createBookmark(details).then((x) => {
    bookmarkAdded();
    setState1("bookmarks.editBar.add", { active: false });
    setState1("bookmarks.editBar.current", null);
  });
};

const closeModal = (e) => {
  setState1("bookmarks.editBar.add", { active: false });
  setState1("bookmarks.editBar.current", null);
};

//view

const update = () => {
  document.getElementById("add-modal-container").innerHTML = "";
  create();
};
const content = () => {
  let isFolder = getState1("bookmarks.editBar.add.isFolder");

  const _content = document.createElement("div");
  const urlInput = new Input({
    type: "text",
    label: "URL",
    value: "https://",
    style: { marginTop: "1rem" },
  });
  const nameInput = new Input({
    type: "text",
    label: "Bookmark Name",
    style: { marginTop: "1rem" },
  });
  const isFolderCheck = new Input({
    type: "checkbox",
    label: "is folder",
    checked: isFolder,
    style: { display: "inline", paddingLeft: "1rem" },
    onClick: (e, checked) => {
      setState1("bookmarks.editBar.add.isFolder", checked);
    },
  });

  if (!isFolder) {
    _content.append(urlInput.create());
  }
  _content.append(nameInput.create());

  const addButton = Button({ label: "add", style: { marginTop: "1rem" } });
  addButton.addEventListener("click", () => {
    addBookmark({
      url: isFolder ? "" : urlInput.getValue(),
      title: nameInput.getValue(),
      parentId: getState1("bookmarks.isSelected"),
    });
  });

  _content.append(addButton);

  //create customized title
  const title = document.createElement("div");
  title.textContent = "Add Bookmark";
  title.style.fontSize = "14px";
  title.append(isFolderCheck.create());

  return Modal({
    title: title,
    id: "add-modal",
    content: _content,
    onClickOverlay: (e) => {
      closeModal(e);
    },
  });
};
const create = () => {
  let view;
  if (document.getElementById("add-modal-container")) {
    view = document.getElementById("add-modal-container");
  } else {
    view = document.createElement("div");
    view.id = "add-modal-container";
  }

  view.append(content());

  return view;
};

register("bookmarks.editBar.add.isFolder", update);
const add = { create };

export default add;
