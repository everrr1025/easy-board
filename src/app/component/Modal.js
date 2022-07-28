import { styleHyphenFormat } from "../utils/utils.js";

/**
 * modal component
 */
const VIEW = {
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

const CONTENT_STYLE = {
  //display: "flex",
  //flexDirection: "column",
  width: "500px",
  margin: "10% auto auto",
  border: "1px solid black",
  backgroundColor: "white",
  padding: "1.5rem",
};

const TITLE_STYLE = {
  backgroundColor: "white",
  // fontSize: "14px",
};

const Modal = (details) => {
  // id - the id of the main content of modal ( not the content of details )
  // onClickOverlay - modal will be colsed by default if overlay is clicked,
  // use onClickOverlay to pass in the next steps
  //title - either a string or a dom element which will be insert into the header directly
  const { id, title, style, content, onClickOverlay } = details;
  const view = document.createElement("div");
  const _content = document.createElement("div");
  //_content.id = id;
  view.id = id;
  view.addEventListener("click", (e) => {
    if (e.target.id !== view.id) return;
    if (onClickOverlay) {
      onClickOverlay(e);
    } else {
      view.style.display = "none";
    }
  });

  if (title && typeof title == "string") {
    const _title = document.createElement("div");

    _title.innerText = title;

    Object.assign(_title.style, styleHyphenFormat(TITLE_STYLE));

    _content.append(_title);
  } else if (title && title instanceof Element) {
    _content.append(title);
  }

  _content.append(content);
  view.append(_content);
  Object.assign(_content.style, styleHyphenFormat(CONTENT_STYLE));
  style && Object.assign(_content.style, styleHyphenFormat(style)); //applay the passed in style
  Object.assign(view.style, styleHyphenFormat(VIEW));
  return view;
};

export default Modal;
