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

const HEAD_STYLE = {
  backgroundColor: "white",
  marginBottom: "0.5rem",
  height: "20%",
  fontSize: "14px",
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

  const head = document.createElement("div");
  head.innerText = "Edit Bookmark";
  content.append(head);
  content.append(urlInput);
  content.append(nameInput);

  view.addEventListener("click", (e) => {
    closeEditModal(e);
  });

  const bnWrapper = document.createElement("div");
  bnWrapper.style.display = "flex";
  bnWrapper.style.marginTop = "0.5rem";
  const saveBn = document.createElement("div");
  saveBn.innerText = "save";

  saveBn.style.padding = "0.3rem";

  saveBn.style.cursor = "pointer";
  saveBn.style.border = "1px solid black";
  saveBn.addEventListener("click", () => {
    updateBookmarks({
      url: document.getElementById("edit-url").value,
      title: document.getElementById("edit-name").value,
      id: editing.id,
    });
  });
  bnWrapper.append(saveBn);
  content.append(bnWrapper);
  view.append(content);
  Object.assign(head.style, styleHyphenFormat(HEAD_STYLE));
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
register("bookmarks.editBar.edit.active", update);
const edit = { create, update };
export default edit;
