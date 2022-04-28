import { getState, getState1, setState1, register } from "../../../state.js";
import { styleHyphenFormat } from "../../utils/utils.js";

/**
 * breadcrumb component
 */

export function toPath(node) {
  return getState("bookmarks").path;
}

const VIEW_STYLE = {
  padding: "0.5rem 0",
};
//style
const PATH_ITEM_STYLE = {
  cursor: "pointer",
};

//action
const onClickBreadcrumb = (e, index) => {
  const prePath = getState1("bookmarks.path");

  prePath.splice(index + 1, prePath.length - index);

  setState1("bookmarks.isSelected", prePath[index].id);
  setState1("bookmarks.path", prePath);
};

//view
function update() {
  if (document.getElementById("breadcrumb")) {
    document.getElementById("breadcrumb").innerHTML = "";
    create();
  }
}

const create = () => {
  let view;
  if (document.getElementById("breadcrumb")) {
    view = document.getElementById("breadcrumb");
  } else {
    view = document.createElement("div");
    view.id = "breadcrumb";
  }

  let x = document.createElement("div");
  const currentNode = getState("bookmarks").isSelected;

  const paths = toPath(currentNode);

  paths.forEach((path, index) => {
    const pathItem = document.createElement("a");
    pathItem.innerText = path.title;
    pathItem.dataset.id = path.id;
    pathItem.addEventListener("click", (e) => {
      onClickBreadcrumb(e, index);
    });
    const header = document.createTextNode("/");
    x.append(header);
    x.append(pathItem);
  });

  Object.assign(x.style, styleHyphenFormat(PATH_ITEM_STYLE));
  view.append(x);
  Object.assign(view.style, styleHyphenFormat(VIEW_STYLE));
  return view;
};

register("bookmarks.isSelected", update);
const breadcrumb = { create, update };

export default breadcrumb;
