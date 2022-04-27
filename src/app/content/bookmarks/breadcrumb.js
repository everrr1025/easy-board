import { getState, setState, registerListener } from "../../../state.js";
import { styleHyphenFormat } from "../../utils/utils.js";
import { getBookmarksByID } from "../../utils/chrome.js";
/**
 * breadcrumb component
 */

// const getPath = (regex, path, index) => {
//   let num = 0;
//   let re = new RegExp(`${regex}`, "g");
//   while (re.exec(path) !== null) {
//     if (num === index) {
//       let result = path.substring(0, re.lastIndex);
//       console.log(result);
//       return result;
//       break;
//     }
//     num++;
//   }
// };

// const toPath = (node) => {
//   const paths = [];

//   if (node.parentId == 1) {
//     const pathObj = {};
//     pathObj.title = node.title;
//     pathObj.nodeId = node.id;
//     paths.push(pathObj);
//   } else {
//   }
//   return paths;
// };

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
  const prePath = getState("bookmarks").path;

  prePath.splice(index + 1, prePath.length - index);
  setState("bookmarks", {
    ...getState("bookmarks"),
    isSelected: prePath[index],
    path: prePath,
  });
};

//view
async function update() {
  if (document.getElementById("breadcrumb")) {
    document.getElementById("breadcrumb").innerHTML = "";
    await create();
  }
}

async function create() {
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
}

registerListener("bookmarks", update);
const breadcrumb = { create, update };

export default breadcrumb;
