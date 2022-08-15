import {
  extractTagsFromBookmarkName,
  extractTitle,
  saveTags,
} from "../../../utils/tag.js";
import { createBookmark } from "../../../utils/chrome.js";
import {
  getState1,
  setState1,
  register,
  bookmarkAdded,
} from "../../../../state.js";

import { Modal, Input, Button } from "../../../component/index.js";
import tag from "../tag.js";
/**
 * add component in edit bar
 */

//const COLORSETTINGS = await getColorSettings();
//action
async function addBookmark(details) {
  const { parentId, title, url } = details;
  const createdBookmark = await createBookmark({
    parentId,
    url,
    title: url ? extractTitle(title) : title,
  });
  await bookmarkAdded(parentId);

  url &&
    (await saveTags(
      createdBookmark,
      extractTagsFromBookmarkName(title),
      "add"
    ));
  closeModal();
}

const onBookmarkNameInput = (e) => {
  const tags = extractTagsFromBookmarkName(e.target.value);
  setState1("bookmarks.editBar.tags", tags);
};
const closeModal = (e) => {
  setState1("bookmarks.editBar.add.active", false);
  setState1("bookmarks.editBar.add.isFolder", false);
  setState1("bookmarks.editBar.current", null);
  setState1("bookmarks.editBar.tags", null);
};

//view

const update = () => {
  if (document.getElementById(ID)) {
    document.getElementById(ID).innerHTML = "";
  }
  create();
};
const content = () => {
  let isFolder = getState1("bookmarks.editBar.add.isFolder");
  const primaryColor = getState1("workspace.primaryColor");
  const _content = document.createElement("div");
  const urlInput = new Input({
    type: "text",
    label: "URL",
    id: "add-bk-url",
    value: "https://",
    inputStyle: { color: primaryColor, border: `1px solid ${primaryColor}` },
    style: { marginTop: "1rem" },
  });
  const nameInput = new Input({
    type: "text",
    label: "Bookmark Name",
    id: "add-bk-name",
    style: { marginTop: "1rem" },
    placeholder: isFolder ? "" : "add '##' after bookmark name to add tags",
    inputStyle: { color: primaryColor, border: `1px solid ${primaryColor}` },
    onInput: (e) => {
      !isFolder && onBookmarkNameInput(e);
    },
  });
  const isFolderCheck = new Input({
    type: "checkbox",
    label: "is folder",
    checked: isFolder,
    boxStyle: { border: `1px solid ${primaryColor}` },
    style: { display: "inline", marginLeft: "1rem" },
    onClick: (e, checked) => {
      setState1("bookmarks.editBar.add.isFolder", checked);
    },
  });

  if (!isFolder) {
    _content.append(urlInput.create());
    setTimeout(() => document.getElementById("add-bk-url").focus(), 0);
  }
  _content.append(nameInput.create());
  isFolder &&
    setTimeout(() => document.getElementById("add-bk-name").focus(), 0);

  if (!isFolder) {
    _content.append(tag.create());
  }
  const addButton = Button({
    label: "add",
    style: { marginTop: "1rem", borderColor: primaryColor },
  });

  addButton.addEventListener("click", async () => {
    let url = urlInput.getValue();
    if (!(url.startsWith("https://") || url.startsWith("http://"))) {
      url = `http://${url}`;
    }
    await addBookmark({
      url: isFolder ? "" : url,
      title: nameInput.getValue(),
      parentId: getState1("bookmarks.isSelected"),
    });
  });

  _content.append(addButton);

  //create customized title
  const title = document.createElement("div");
  title.textContent = "Add Bookmark";
  // title.style.fontSize = "14px";
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

let ID;
const create = () => {
  let popup;
  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "add-modal-wrapper";
  }
  if (getState1("bookmarks.editBar.add.active")) {
    popup.append(content());
  }
  return popup;
};
register("bookmarks.editBar.add.active", update);

register("bookmarks.editBar.add.isFolder", update);
const add = { create };

export default add;
