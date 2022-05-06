import { getChildren } from "./utils.js";
import { getState1, bookmarkAdded } from "../../state.js";
/**
 * module to encapsulate chrome extension API
 */
const FOLDER = "pinecone"; //the default folder to query bookmarks

export async function getBookmarks(folder) {
  const search = folder ? folder : FOLDER;
  let nodes = await chrome.bookmarks.search(search);
  let node = nodes.filter((bookmark) => !bookmark.url)[0]; //suppose the 1st one that matched
  let xx = await chrome.bookmarks.getSubTree(node.id);
  return xx[0];
}

export async function getSubtree(id) {
  return await chrome.bookmarks.getSubTree(id);
}
export async function getBookmarksByID(nodeId) {
  let node = await chrome.bookmarks.get(nodeId);
  return node;
}

export async function createBookmark(details, cb) {
  let node = await chrome.bookmarks.create(details);
  return node;
}

export async function updateBookmark(details) {
  const { id, url, title } = details;

  return await chrome.bookmarks.update(id, { url, title });
}

export async function removeBookmark(details) {
  const { id } = details;
  return await chrome.bookmarks.remove(id);
}

export const compareNodes = (a, b) => {
  if ((a.url && b.url) || (!a.url && !b.url)) {
    return a.dateAdded > b.dateAdded ? 1 : -1;
  }

  if (a.url && !b.url) {
    return 1;
  }
  if (!a.url && b.url) {
    return -1;
  }
};
//storage api
export async function setUserData(obj) {
  return await chrome.storage.local.set(obj);
}

export async function getUserData(key) {
  return await chrome.storage.local.get(key);
}

/*
const bk = {
    children:[],
    dateAdded:
    dateGroupModified:
    id:'558',
    index:13,
    parentId:'1',
    title:'haha'
}
*/
//listen to chrome bookmark updated
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action } = request;
  let message;
  switch (action) {
    case "create": {
      message = createHandler(request);
      break;
    }
    case "delete": {
      message = deleteHandler(request);
      break;
    }
    case "change": {
      message = changeHandler(request);
      break;
    }
    case "move": {
      message = moveHandler(request);
      break;
    }
  }

  sendResponse(message);
});

const createHandler = (request) => {
  const { bookmark } = request; //updated bookmark id
  //check if it belongs to the selected workspace
  const bks = getState1("bookmarks.bks");
  const parent = getChildren(bks, bookmark.parentId);
  //if parent found, then update the workspace bookmark tree
  if (parent) {
    bookmarkAdded();
    return { farewell: "workspace bookmarks updated" };
  } else {
    return { farewell: "do nothing" };
  }
};

const deleteHandler = (request) => {
  const { id } = request;

  const bks = getState1("bookmarks.bks");
  const removedBookmark = getChildren(bks, id);

  if (removedBookmark) {
    bookmarkAdded();
    return { farewell: "workspace bookmarks updated" };
  } else {
    return { farewell: "do nothing" };
  }
};

const changeHandler = (request) => {
  const { id } = request;
  const bks = getState1("bookmarks.bks");
  const changedBookmark = getChildren(bks, id);
  if (changedBookmark) {
    bookmarkAdded();
    return { farewell: "workspace bookmarks updated" };
  } else {
    return { farewell: "do nothing" };
  }
};

const moveHandler = (request) => {
  const { id, moveInfo } = request;
  const { parentId, oldParentId } = moveInfo;
  const bks = getState1("bookmarks.bks");
  const moveIn = getChildren(bks, parentId) ? true : null;
  const moveOut = getChildren(bks, oldParentId) ? true : null;
  //check if the new parentId belongs to the workspace
  if (moveIn || moveOut) {
    bookmarkAdded();
    return { farewell: "workspace bookmarks updated" };
  } else {
    return { farewell: "do nothing" };
  }
};
