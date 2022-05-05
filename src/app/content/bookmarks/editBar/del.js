import { styleHyphenFormat } from "../../../utils/utils.js";
import { Input } from "../../../component/index.js";
import {
  register,
  getState1,
  setState1,
  bookmarkAdded,
} from "../../../../state.js";
import { removeBookmark } from "../../../utils/chrome.js";
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

const deleteBookmark = (details) => {
  removeBookmark(details).then((e) => {
    bookmarkAdded(getState1("bookmarks.isSelected"));
    setState1("bookmarks.editBar.delete.deleting", null);
  });
};
const closeEditModal = (e) => {
  if (e.target.id == "delete-modal")
    setState1("bookmarks.editBar.delete.deleting", null);
};
const update = () => {
  document.getElementById(ID).innerHTML = "";
  create();
};

let ID = "";

const content = () => {
  const { deleting } = getState1("bookmarks.editBar.delete");
  let view;
  if (!document.getElementById("delete-modal")) {
    view = document.createElement("div");
    view.id = "delete-modal";
  } else {
    view = document.getElementById("delete-modal");
  }

  const content = document.createElement("div");

  const urlInput = new Input({
    label: "URL",
    id: "delete-url",
    disabled: true,
    value: !deleting ? "" : deleting.url,
  }).create();
  const nameInput = new Input({
    label: "Name",
    id: "delete-name",
    disabled: true,
    value: !deleting ? "" : deleting.title,
  }).create();

  const head = document.createElement("div");
  head.innerText = "Delete Bookmark";
  content.append(head);
  deleting && deleting.url && content.append(urlInput);
  content.append(nameInput);

  view.addEventListener("click", (e) => {
    closeEditModal(e);
  });

  const bnWrapper = document.createElement("div");
  bnWrapper.style.display = "flex";
  bnWrapper.style.marginTop = "0.5rem";
  const delBn = document.createElement("div");
  delBn.innerText = "delete";

  delBn.style.padding = "0.3rem";

  delBn.style.cursor = "pointer";
  delBn.style.border = "1px solid black";
  delBn.addEventListener("click", () => {
    deleteBookmark({
      id: deleting.id,
    });
  });
  bnWrapper.append(delBn);
  content.append(bnWrapper);
  view.append(content);
  Object.assign(head.style, styleHyphenFormat(HEAD_STYLE));
  Object.assign(content.style, styleHyphenFormat(CONTENT_VIEW_STYLE));
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};
const create = () => {
  let popup;

  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "del-modal-wrapper";
  }
  popup.append(content());
  const { deleting } = getState1("bookmarks.editBar.delete");
  popup.style.display = deleting ? "block" : "none";
  return popup;
};
register("bookmarks.editBar.delete.deleting", update);
const del = { create, update };

export default del;
