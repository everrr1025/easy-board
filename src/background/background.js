import { getUserData, updateBookmark } from "../app/utils/chrome.js";
import { shouldSyncStorage, getChildBookmarks } from "./utils.js";
import { getChildren } from "../app/utils/utils.js";
import {
  isBookmarkExistInStorage,
  extractTagsFromBookmarkName,
  extractTitle,
  saveTags,
  removeBookmarkTags,
} from "../app/utils/tag.js";

import {
  addBookmarkInStorage,
  removeBookmarkInStorage,
  isEasyBoardTabsOpen,
} from "./utils.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ active: true });
});

chrome.tabs.onCreated.addListener((tab) => {
  chrome.tabs
    .query({ windowId: tab.windowId, url: "chrome://newtab/" })
    .then((result) => {
      if (result.length == 1) return; //only 1 tab is active in a window
      chrome.tabs.update(result[0].id, { active: true });
      chrome.tabs.remove(tab.id);
    });
});

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  isEasyBoardTabsOpen().then((isOpen) => {
    if (isOpen) {
      chrome.runtime.sendMessage(
        { id, bookmark, action: "create" },
        function (response) {
          response && console.log(response.farewell);
        }
      );
    } else {
      syncUp({ details: { id, bookmark }, action: "create" });
    }
  });
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  isEasyBoardTabsOpen().then((isOpen) => {
    if (isOpen) {
      chrome.runtime.sendMessage(
        { id, removeInfo, action: "delete" },
        function (response) {
          response && console.log(response.farewell);
        }
      );
    } else {
      syncUp({ details: { id, removeInfo }, action: "delete" });
    }
  });
});
//only title and url changes trigger this
chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  isEasyBoardTabsOpen().then((isOpen) => {
    if (isOpen) {
      chrome.runtime.sendMessage(
        { id, changeInfo, action: "change" },
        function (response) {
          response && console.log(response.farewell);
        }
      );
    } else {
      syncUp({ details: { id, changeInfo }, action: "change" });
    }
  });
});

chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
  isEasyBoardTabsOpen().then((isOpen) => {
    if (isOpen) {
      chrome.runtime.sendMessage(
        { id, moveInfo, action: "move" },
        function (response) {
          console.log(response.farewell);
        }
      );
    } else {
      syncUp({ details: { id, moveInfo }, action: "move" });
    }
  });
});

const syncUp = async (request) => {
  const { details, action } = request;
  switch (action) {
    case "create": {
      await createHandler(details);
      break;
    }
    case "delete": {
      await deleteHandler(details);
      break;
    }
    case "change": {
      await changeHandler(details);
      break;
    }
    case "move": {
      await moveHandler(details);
      break;
    }
  }
};

const createHandler = async (details) => {
  const { id, bookmark } = details;
  const shouldSync = await shouldSyncStorage(bookmark, "create");
  if (shouldSync) {
    const isExist = await isBookmarkExistInStorage(id);
    if (!isExist) {
      const tags = extractTagsFromBookmarkName(bookmark.title);
      if (tags.length > 0) {
        const details = {
          title: extractTitle(bookmark.title),
          id: bookmark.id,
          url: bookmark.url,
        };
        await updateBookmark(details);
        await saveTags(bookmark, tags, "add");
      } else {
        await saveTags(bookmark, tags, "add");
      }
    }
  } else {
    //do nothing
  }
};

const deleteHandler = async (details) => {
  const { id, removeInfo } = details;
  const { node: bookmark } = removeInfo;
  const isWS = await isWorkspace(id);

  if (isWS) {
    await chrome.storage.sync.clear();
  } else if (await shouldSyncStorage(removeInfo, "remove")) {
    const bookmarks = bookmark.url ? [bookmark] : getChildBookmarks(bookmark);
    await removeBookmarkInStorage(bookmarks);
  } else {
    //do nothing
  }
};

const changeHandler = async (details) => {
  const { id, changeInfo } = details;
  const shouldSync = await shouldSyncStorage({ ...changeInfo, id }, "change");
  if (shouldSync) {
    const { title, url } = changeInfo;
    const tags = extractTagsFromBookmarkName(title);
    if (url) {
      //bookmark name changed with '##' in chrome bookmark bar
      const titleWithoutTags = extractTitle(title);
      await updateBookmark({ id, title: titleWithoutTags });
      await saveTags({ id, title: titleWithoutTags }, tags, "xxx");
    }
  } else {
    //do nothing
  }
};

const moveHandler = async (details) => {
  const { id, moveInfo } = details;
  const shouldSync = await shouldSyncStorage(moveInfo, "move");
  if (shouldSync) {
    const storage = await getUserData(["easyBoard", "bookmarkTags"]);
    const wsId = storage.easyBoard.bookmarks.isSelected.id;
    const { parentId, oldParentId } = moveInfo;
    const subTree = await chrome.bookmarks.getSubTree(wsId);
    const inWorkspace = getChildren(subTree[0], parentId) ? true : false;
    const oldInWorkspace = getChildren(subTree[0], oldParentId) ? true : false;
    if (inWorkspace && !oldInWorkspace) {
      //move in
      const bookmarks = await chrome.bookmarks.getSubTree(id);
      const bks = bookmarks[0].url
        ? bookmarks
        : getChildBookmarks(bookmarks[0]);

      for (const bk of bks) {
        // if (bk.url) {
        const tags = extractTagsFromBookmarkName(bk.title); //const 可以重复定义？
        if (tags.length > 0) {
          const titleWithoutTags = extractTitle(bk.title);
          await updateBookmark({
            id: bk.id,
            title: titleWithoutTags,
          });
          await saveTags({ id: bk.id, title: titleWithoutTags }, tags, "xxx");
        } else {
          await saveTags({ id: bk.id, title: bk.title }, tags, "xxx");
        }
        //}
      }
      // await addBookmarkInStorage(bks, []);
    } else if (!inWorkspace && oldInWorkspace) {
      //move out
      const bookmarks = await chrome.bookmarks.getSubTree(id);
      // const bks = bookmarks[0].url
      //   ? bookmarks
      //   : getChildBookmarks(bookmarks[0]);
      await removeBookmarkTags(bookmarks);
    }
  }
};
const isWorkspace = async (id) => {
  const userData = await getUserData(["easyBoard"]);
  const wsId = userData.easyBoard.bookmarks.isSelected.id;
  return id == wsId ? true : false;
};
