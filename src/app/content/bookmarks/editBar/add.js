import { styleHyphenFormat } from "../../../utils/utils.js";
import { createBookmark } from "../../../utils/chrome.js";
import { getState1, setState1, bookmarkAdded } from "../../../../state.js";

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
const content = () => {
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
  _content.append(urlInput.create());
  _content.append(nameInput.create());
  const addButton = Button({ label: "add", style: { marginTop: "1rem" } });
  addButton.addEventListener("click", () => {
    addBookmark({
      url: urlInput.getValue(),
      title: nameInput.getValue(),
      parentId: getState1("bookmarks.isSelected"),
    });
  });

  _content.append(addButton);

  return Modal({
    title: "Add Bookmark",
    id: "add-modal",
    content: _content,
    onClickOverlay: (e) => {
      closeModal(e);
    },
  });
};
const create = () => {
  const view = document.createElement("div");
  view.append(content());
  return view;
};

const add = { create };

export default add;
