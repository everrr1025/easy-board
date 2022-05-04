import { Input, Modal, Button } from "../../../component/index.js";
import {
  register,
  getState1,
  setState1,
  bookmarkAdded,
} from "../../../../state.js";
import { updateBookmark } from "../../../utils/chrome.js";

/**
 * edit window
 */

const updateBookmarks = (details) => {
  updateBookmark(details).then((e) => {
    bookmarkAdded();
    setState1("bookmarks.editBar.edit.editing", null);
  });
};

const closeEditModal = (e) => {
  setState1("bookmarks.editBar.edit.editing", null);
};

let ID;
const update = () => {
  document.getElementById(ID).innerHTML = "";
  create();
};

const content = () => {
  const editing = getState1("bookmarks.editBar.edit.editing");
  const urlInput = new Input({
    label: "URL",
    value: editing.url,
    style: { marginTop: "1rem" },
  });
  const nameInput = new Input({
    label: "Bookmark Name",
    value: editing.title,
    style: { marginTop: "1rem" },
  });
  const editButton = Button({ label: "save", style: { marginTop: "1rem" } });
  editButton.addEventListener("click", () => {
    updateBookmarks({
      url: editing.url ? urlInput.getValue() : undefined,
      title: nameInput.getValue(),
      id: editing.id,
    });
  });
  const _content = document.createElement("div");
  if (editing.url) {
    _content.append(urlInput.create());
  }
  _content.append(nameInput.create());
  _content.append(editButton);
  return Modal({
    title: "Edit Bookmarks",
    content: _content,
    onClickOverlay: (e) => {
      closeEditModal(e);
    },
  });
};
const create = () => {
  let popup;

  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "edit-modal-wrapper";
  }

  if (getState1("bookmarks.editBar.edit.editing")) {
    popup.append(content());
  }
  return popup;
};
register("bookmarks.editBar.edit.editing", update);
const edit = { create, update };
export default edit;
