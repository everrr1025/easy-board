/**
 * utils for background
 */
import { getBookmarks, getSubtree } from "../app/utils/chrome.js";
import { getChildren } from "../app/utils/utils.js";

export async function setUserData(obj) {
  return await chrome.storage.sync.set(obj);
}

export async function getUserData(key) {
  return await chrome.storage.sync.get(key);
}

/**
 *
 * @param {*} bookmark - chrome bookmark node
 * @param {*} tags - tags array
 * @returns
 */
export const addBookmarkInStorage = async (bookmark, tags) => {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
  bookmarksMap.set(bookmark.id, tags);
  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarksMap]),
  });
};

/**
 *
 * @param {*} bookmark - chrome bookmark node
 */
export const removeBookmarkInStorage = async (bookmarkNode) => {
  const storage = await getUserData(["bookmarkTags", "tags"]);
  const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
  const tagsMap = new Map(JSON.parse(storage.tags));

  const xx = bookmarkNode.url
    ? [bookmarkNode]
    : getChildBookmarks(bookmarkNode);
  for (const bk of xx) {
    const bkTags = bookmarksMap.get(bk.id);
    for (const tag of bkTags) {
      if (tagsMap.has(tag.title)) {
        const tagInMap = tagsMap.get(tag.title);
        tagInMap.bookmarks.splice(tagInMap.bookmarks.indexOf(bk.id), 1);
        tagsMap.set(tag.title, tagInMap);
      }
    }
    bookmarksMap.delete(bk.id);
  }

  return await setUserData({
    tags: JSON.stringify([...tagsMap]),
    bookmarkTags: JSON.stringify([...bookmarksMap]),
  });
};

export const isEasyBoardTabsOpen = async () => {
  const x = await sendMessagePromise({ action: "isEasyBoardTabsOpen" });

  return x.result;
};

export const shouldSyncStorage = async (bookmarkNode, action) => {
  let shouldSync = false;
  const storage = await getUserData(["easyBoard", "bookmarkTags"]);
  const wsId = storage.easyBoard.bookmarks.isSelected.id;
  if (action == "create" && bookmarkNode.url) {
    //no need to update storage for folder
    const subTree = await chrome.bookmarks.getSubTree(wsId);
    const bk = getChildren(subTree[0], bookmarkNode.id);
    shouldSync = bk ? true : false;
  } else if (action == "remove") {
    const deletedBookmarks = getChildBookmarks(bookmarkNode);
    const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
    shouldSync = !deletedBookmarks.every((bk) => {
      return !bookmarksMap.has(bk.id);
    });
  }
  return shouldSync;
};

const sendMessagePromise = async (details) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(details, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.log(lastError.message);
        resolve({ result: false });
      } else {
        if (response) {
          resolve(response);
        }
      }
    });
  }).catch((error) => {
    //do nothing
  });
};

const getChildBookmarks = (bookmarkNode) => {
  const result = [];
  let inner = (bookmarkNode) => {
    if (bookmarkNode.url) {
      result.push({ id: bookmarkNode.id, title: bookmarkNode.title });
    }
    if (bookmarkNode.children) {
      for (const node of bookmarkNode.children) {
        inner(node);
      }
    }
    return result;
  };
  return inner(bookmarkNode);
};
