import { Input, Modal, Button, Select } from "../../../component/index.js";
import {
  register,
  getState1,
  setState1,
  bookmarkAdded,
} from "../../../../state.js";
import { updateBookmark, moveBookmark } from "../../../utils/chrome.js";
import { getFolders, getFullPath } from "../../../utils/utils.js";
import tag from "../tag.js";

/**
 * edit window
 */

async function onEditSaveClick(details) {
  const { editing, title, url, selectedFolderId } = details;

  if (editing.title != title || editing.url !== url) {
    await updateBookmark({ id: editing.id, url, title });
  }
  if (editing.parentId != selectedFolderId) {
    await moveBookmark({ id: editing.id, selectedFolderId });
  }

  bookmarkAdded();
  setState1("bookmarks.editBar.edit.editing", null);
}

const closeEditModal = (e) => {
  setState1("bookmarks.editBar.edit.editing", null);
  setState1("bookmarks.editBar.tags", null);
};

let ID;
const update = () => {
  document.getElementById(ID).innerHTML = "";
  create();
};

const content = () => {
  const editing = getState1("bookmarks.editBar.edit.editing");
  const tags = getState1("bookmarks.editBar.tags");
  const bks = getState1("bookmarks.bks");
  const folders = getFolders(bks);
  const options = [];
  for (const folder of folders) {
    //current folder should be not an option
    if (folder.id != editing.id) {
      //neither subfolders of current folder
      const fullPath = getFullPath(bks, folder.id, editing.id).reverse();
      if (fullPath.length > 0) {
        const x = fullPath.join(" / ");
        options.push({ value: folder.id, title: x });
      }
    }
  }
  const urlInput = new Input({
    label: "URL",
    value: editing.url,
    style: { marginTop: "1rem" },
  });
  const nameWithTags = editing.url
    ? tags.reduce((previous, current) => {
        return previous + "##" + current.title;
      }, editing.title)
    : editing.title;
  const nameInput = new Input({
    label: "Bookmark Name",
    value: nameWithTags,
    style: { marginTop: "1rem" },
  });

  const selectFolder = new Select({
    label: "Select folder to move",
    style: { marginTop: "1rem" },
    selected: editing.parentId,
    options: options,
  });
  const editButton = Button({ label: "save", style: { marginTop: "1rem" } });
  editButton.addEventListener("click", async () => {
    await onEditSaveClick({
      url: editing.url ? urlInput.getValue() : "",
      title: nameInput.getValue(),
      selectedFolderId: selectFolder.getValue(),
      editing,
    });
  });
  const _content = document.createElement("div");
  if (editing.url) {
    _content.append(urlInput.create());
  }
  _content.append(nameInput.create());
  if (editing.url) {
    _content.append(tag.create());
  }
  _content.append(selectFolder.create());
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
