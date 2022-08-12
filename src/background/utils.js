/**
 * utils for background
 */
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
export const addBookmarkInStorage = async (bookmarks, tags) => {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
  for (const bk of bookmarks) {
    bookmarksMap.set(bk.id, tags);
  }
  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarksMap]),
  });
};

/**
 *
 * @param {*} bookmark - chrome bookmark node
 */
export const removeBookmarkInStorage = async (bookmarks) => {
  const storage = await getUserData(["bookmarkTags", "tags"]);
  const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
  const tagsMap = new Map(JSON.parse(storage.tags));

  for (const bk of bookmarks) {
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

export const shouldSyncStorage = async (info, action) => {
  let shouldSync = false;
  const storage = await getUserData(["easyBoard", "bookmarkTags"]);
  const wsId = storage.easyBoard.bookmarks.isSelected.id;
  //pass bookmark as info for creation
  if (action == "create" && info.url) {
    const bookmark = info;
    if (bookmark.url) {
      const subTree = await chrome.bookmarks.getSubTree(wsId);
      const bk = getChildren(subTree[0], bookmark.id);
      shouldSync = bk ? true : false;
    }
    //no need to update storage for folder
  } else if (action == "remove") {
    const { node: bookmark } = info;
    const deletedBookmarks = getChildBookmarks(bookmark);
    const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
    shouldSync = !deletedBookmarks.every((bk) => {
      return !bookmarksMap.has(bk.id);
    });
  } else if (action == "move") {
    const { parentId, oldParentId } = info;
    const subTree = await chrome.bookmarks.getSubTree(wsId);
    const inWorkspace = getChildren(subTree[0], parentId) ? true : null;
    const oldInWorkspace = getChildren(subTree[0], oldParentId) ? true : null;
    if ((inWorkspace && oldInWorkspace) || (!inWorkspace && !oldInWorkspace)) {
      //move inside workspace, do nothing
    } else if (inWorkspace && !oldInWorkspace) {
      //move in
      shouldSync = true;
    } else if (!inWorkspace && oldInWorkspace) {
      //move out ,
      shouldSync = true;
    }
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

export const getChildBookmarks = (bookmarkNode) => {
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
