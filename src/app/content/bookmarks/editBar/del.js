import { styleHyphenFormat } from "../../../utils/utils.js";
import { getColorSettings } from "../../../utils/workspace.js";
import { Input, Button } from "../../../component/index.js";
import {
  register,
  getState1,
  setState1,
  bookmarkAdded,
} from "../../../../state.js";
import { removeBookmark } from "../../../utils/chrome.js";
import { deleteTags } from "../../../utils/tag.js";
/**
 * edit window
 */

//const COLORSETTINGS = await getColorSettings();
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

async function deleteBookmark(details) {
  const { notEmpty } = details;
  if (notEmpty) {
    alert("not allow to remove non-empty folder");
    return;
  }
  await removeBookmark(details);
  details.url && (await deleteTags([details])); //if not folder, remove related tags info from local storage
  await bookmarkAdded(getState1("bookmarks.isSelected"));
  setState1("bookmarks.editBar.delete.deleting", null);
}
const closeEditModal = (e) => {
  if (e.target.id == "delete-modal")
    setState1("bookmarks.editBar.delete.deleting", null);
};
const update = () => {
  if (document.getElementById(ID)) {
    document.getElementById(ID).innerHTML = "";
  }
  create();
};

let ID = "";

const content = () => {
  const primaryColor = getState1("workspace.primaryColor");

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
    //id: "delete-url",
    disabled: true,
    inputStyle: { border: "none", color: primaryColor },
    value: !deleting ? "" : deleting.url,
  }).create();
  const nameInput = new Input({
    label: "Name",
    //id: "delete-name",
    disabled: true,
    inputStyle: { border: "none", color: primaryColor },
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
  const delButton = Button({
    label: "delete",
    style: { marginTop: "1rem", border: `1px solid ${primaryColor}` },
  });

  delButton.addEventListener("click", async () => {
    await deleteBookmark({
      id: deleting.id,
      url: deleting.url,
      notEmpty:
        deleting.children && deleting.children.length > 0 ? true : false,
    });
  });
  bnWrapper.append(delButton);
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
