const FOLDER = "松果"; //the default folder to query bookmarks
const LINK_STYLE = "#55624c";

export async function getBookmarks() {
  let nodes = await chrome.bookmarks.search(FOLDER);
  let node = nodes.filter((bookmark) => !bookmark.url)[0]; //suppose the 1st one that matched
  return await chrome.bookmarks.getChildren(node.id);
}

export function createPagesView(bookmakrNodes) {
  let root = document.getElementById("page-view");
  bookmakrNodes.forEach((bookmark) => {
    let view = document.createElement("div");
    let link = document.createElement("a");
    link.href = bookmark.url;
    link.innerText = bookmark.title;
    link.target = "_blank";
    link.style.color = LINK_STYLE;
    link.style.textDecoration = "none";
    view.append(link);
    root.append(view);
  });
}
