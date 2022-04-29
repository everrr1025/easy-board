import Input from "../../component/Input.js";
import {
  register,
  getState1,
  setState1,
  bookmarkAdded,
} from "../../../../state.js";
import { styleHyphenFormat } from "../../../utils/utils.js";
import { updateBookmark } from "../../../utils/chrome.js";

/**
 * edit window
 */
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

const updateBookmarks = (details) => {
  updateBookmark(details).then((e) => {
    bookmarkAdded();
    setState1("bookmarks.editBar.edit.editing", null);
  });
};

const closeEditModal = (e) => {
  if (e.target.id == "edit-modal")
    setState1("bookmarks.editBar.edit.editing", null);
};
const update = () => {
  document.getElementById("xxx").innerHTML = "";
  create();
};

//const content = () => {};

const content = () => {
  const { editing } = getState1("bookmarks.editBar.edit");
  let view;
  if (!document.getElementById("edit-modal")) {
    view = document.createElement("div");
    view.id = "edit-modal";
  } else {
    view = document.getElementById("edit-modal");
  }

  const content = document.createElement("div");

  const urlInput = Input({
    label: "URL",
    id: "edit-url",
    value: !editing ? "" : editing.url,
  });
  const nameInput = Input({
    label: "Name",
    id: "edit-name",
    value: !editing ? "" : editing.title,
  });
  content.append(urlInput);
  content.append(nameInput);

  view.addEventListener("click", (e) => {
    closeEditModal(e);
  });

  const saveBn = document.createElement("div");
  saveBn.innerText = "save";
  saveBn.style.width = "2rem";
  saveBn.addEventListener("click", () => {
    updateBookmarks({
      url: document.getElementById("edit-url").value,
      title: document.getElementById("edit-name").value,
      id: editing.id,
    });
  });

  content.append(saveBn);
  view.append(content);

  Object.assign(content.style, styleHyphenFormat(CONTENT_VIEW_STYLE));
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

const create = () => {
  let popup;
  if (!document.getElementById("xxx")) {
    popup = document.createElement("div");
    popup.id = "xxx";
  } else {
    popup = document.getElementById("xxx");
  }

  popup.append(content());

  const editing = getState1("bookmarks.editBar.edit.editing");
  popup.style.display = editing ? "block" : "none";
  return popup;
};

register("bookmarks.editBar.edit.editing", update);
const edit = { create, update };
export default edit;
