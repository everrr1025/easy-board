import { Input, Modal, Button, Select } from "../../../component/index.js";
import {
  extractTagsFromBookmarkName,
  extractTitle,
  saveTags,
} from "../../../utils/tag.js";
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
//const COLORSETTINGS = await getColorSettings();
async function onEditSaveClick(details) {
  const { editing, title, url, selectedFolderId } = details;

  // const bookmarkTitle = url ? extractTitle(title) : title
  const bookmarkTitle = extractTitle(title);

  //update bookmark url,title in chrome
  if (editing.title != bookmarkTitle || editing.url !== url) {
    try {
      await updateBookmark({
        id: editing.id,
        url,
        title: bookmarkTitle,
      });
    } catch (error) {
      alert("Invalid URL");
      return;
    }
  }

  //update bookmark parent in chrome
  if (editing.parentId != selectedFolderId) {
    await moveBookmark({ id: editing.id, selectedFolderId });
  }

  await bookmarkAdded();

  //no need to compare with the saved tags, just update the storage
  url && (await saveTags(editing, extractTagsFromBookmarkName(title), "edit"));
  closeEditModal();
}

const onBookmarkNameInput = (e) => {
  const tags = extractTagsFromBookmarkName(e.target.value);
  setState1("bookmarks.editBar.tags", tags);
};
const closeEditModal = (e) => {
  setState1("bookmarks.editBar.edit.editing", null);
  setState1("bookmarks.editBar.tags", null);
};

let ID;
const update = () => {
  if (document.getElementById(ID)) {
    document.getElementById(ID).innerHTML = "";
  }
  create();
};

const content = () => {
  const primaryColor = getState1("workspace.primaryColor");
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
    inputStyle: { color: primaryColor, border: `1px solid ${primaryColor}` },
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

    inputStyle: { color: primaryColor, border: `1px solid ${primaryColor}` },
    style: { marginTop: "1rem" },
    onInput: (e) => {
      editing.url && onBookmarkNameInput(e);
    },
  });

  const selectFolder = new Select({
    label: "Select folder to move",
    style: { marginTop: "1rem" },
    selectStyle: { color: primaryColor, border: `1px solid ${primaryColor}` },
    selected: editing.parentId,
    options: options,
  });
  const editButton = Button({
    label: "save",
    style: { marginTop: "1rem", borderColor: primaryColor },
  });
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
    setTimeout(() => urlInput.getInputElement().focus(), 0);
  }
  _content.append(nameInput.create());
  !editing.url && setTimeout(() => nameInput.getInputElement().focus(), 0);
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
