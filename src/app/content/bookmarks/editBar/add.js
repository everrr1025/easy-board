import { styleHyphenFormat } from "../../../utils/utils.js";
import { extractTags, extractTitle, saveTags } from "../../../utils/tag.js";
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

//action
async function addBookmark(details) {
  const { parentId, title, url } = details;
  const createdBookmark = await createBookmark({
    parentId,
    url,
    title: extractTitle(title),
  });
  bookmarkAdded(parentId);

  url && (await saveTags(createdBookmark.id, extractTags(title)));
  setState1("bookmarks.editBar.add", { active: false });
  setState1("bookmarks.editBar.current", null);
}

const onBookmarkNameInput = (e) => {
  const tags = extractTags(e.target.value);
  setState1("bookmarks.editBar.tags", tags);
};
const closeModal = (e) => {
  setState1("bookmarks.editBar.add", { active: false });
  setState1("bookmarks.editBar.current", null);
  setState1("bookmarks.editBar.tags", null);
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
    onInput: (e) => {
      !isFolder && onBookmarkNameInput(e);
    },
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

  if (!isFolder) {
    _content.append(tag.create());
  }
  const addButton = Button({ label: "add", style: { marginTop: "1rem" } });

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
