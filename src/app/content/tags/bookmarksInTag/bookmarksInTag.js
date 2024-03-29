import { Modal } from "../../../component/index.js";
import { setState1, getState1, register } from "../../../../state.js";
import { styleHyphenFormat } from "../../../utils/utils.js";
import { openExtensionTab } from "../../../utils/chrome.js";

const BOOKMARKS_VIEW_STYLE = {
  display: "flex",
  flexWrap: "wrap",
  marginTop: "1rem",
};

const BOOKMARK_ITEM_VIEW_STYLE = {
  // fontSize: "14px",
  backgroundColor: "white",
  cursor: "pointer",
  border: "1px solid black",
  padding: "0.5rem",
  margin: "0 1rem 1rem 0 ",
  minWidth: "1rem",
  maxWidth: "8rem",
  overflow: "hidden",
  textAlign: "center",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const closeModal = (e) => {
  setState1("tags.bookmarksInTag.active", false);
  //setState1("tags.editBar.current", null);
};
let ID;

const update = () => {
  document.getElementById(ID).innerHTML = "";
  create();
};

const content = (currentTag) => {
  const primaryColor = getState1("workspace.primaryColor");
  const { title, bookmarksInTag } = currentTag;
  const _content = document.createElement("div");
  const _bookmarksView = document.createElement("div");
  Object.assign(_bookmarksView.style, styleHyphenFormat(BOOKMARKS_VIEW_STYLE));
  styleHyphenFormat;
  for (const bk of bookmarksInTag) {
    const bk_view = document.createElement("div");
    bk_view.addEventListener("click", async (e) => {
      if (bk.url.startsWith("chrome://")) openExtensionTab(bk.url);
      else window.open(bk.url, "_blank");
    });
    bk_view.innerText = bk.title;
    Object.assign(
      bk_view.style,
      Object.assign(styleHyphenFormat(BOOKMARK_ITEM_VIEW_STYLE), {
        borderColor: primaryColor,
      })
    );
    _bookmarksView.append(bk_view);
  }

  _content.append(_bookmarksView);

  const titleEle = document.createElement("div");
  titleEle.style.color = "red";
  titleEle.innerText = title;

  return Modal({
    title: titleEle,
    id: "bookmarks-in-tag-modal",
    content: _content,
    onClickOverlay: (e) => {
      closeModal(e);
    },
  });
};

const create = () => {
  let popup;
  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "bookmarksInTag-modal-wrapper";
  }

  if (getState1("tags.bookmarksInTag.active")) {
    const currentTag = getState1("tags.bookmarksInTag.current");
    popup.append(content(currentTag));
  }

  //popup.style.display = deleting ? "block" : "none";
  return popup;
};

register("tags.bookmarksInTag.active", update);
const bookmarksInTag = { create };
export default bookmarksInTag;
