import { getChildren, getBookmarks } from "./utils.js";
import { setState1, getState1, bookmarkAdded } from "../../state.js";
import {
  updateBookmarkTags,
  removeBookmarkTags,
  isBookmarkExistInStorage,
  extractTagsFromBookmarkName,
  extractTitle,
  saveTags,
} from "./tag.js";

/**
 * module to encapsulate chrome extension API
 */
const FOLDER = "pinecone"; //the default folder to query bookmarks

// export async function getBookmarks(folder) {
//   const search = folder ? folder : FOLDER;
//   let nodes = await chrome.bookmarks.search(search);
//   let node = nodes.filter((bookmark) => !bookmark.url)[0]; //suppose the 1st one that matched
//   let xx = await chrome.bookmarks.getSubTree(node.id);
//   return xx[0];
// }

export async function getSubtree(id) {
  return await chrome.bookmarks.getSubTree(id);
}
export async function getBookmarksByID(nodeId) {
  let node = await chrome.bookmarks.get(nodeId);
  return node;
}

export async function createBookmark(details) {
  setState1("workspace.preventEvent", true);
  let node = await chrome.bookmarks.create(details);
  return node;
}

export async function updateBookmark(details) {
  setState1("workspace.preventEvent", true);
  const { id, url, title } = details;
  return await chrome.bookmarks.update(id, { title, url });
}

export async function moveBookmark(details) {
  setState1("workspace.preventEvent", true);
  const { id, selectedFolderId } = details;
  return await chrome.bookmarks.move(id, { parentId: selectedFolderId });
}
export async function removeBookmark(details) {
  setState1("workspace.preventEvent", true);
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
//ATTENTION: MAX_WRITE_OPERATIONS_PER_MINUTE / 120 per minute
export async function setUserData(obj) {
  return await chrome.storage.sync.set(obj);
}

export async function getUserData(key) {
  return await chrome.storage.sync.get(key);
}

//listen to chrome bookmark updated
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action } = request;
  if (action == "isEasyBoardTabsOpen") {
    const views = chrome.extension.getViews({ type: "tab" });
    sendResponse({ result: views.length > 0 ? true : false });
    return false;
  }
  const preventEvent = getState1("workspace.preventEvent");

  //if bookmark created in easyboard, then prevent the message
  if (preventEvent) {
    setState1("workspace.preventEvent", false);
    sendResponse({ farewell: "event get prevented" });
    return true;
  }
  handler(request, sender, sendResponse);
  return true;
});

//in other cases...
const handler = async (request, sender, sendResponse) => {
  const { action } = request;
  let message;
  switch (action) {
    case "create": {
      message = await createHandler(request);
      break;
    }
    case "delete": {
      message = await deleteHandler(request);
      break;
    }
    case "change": {
      message = await changeHandler(request);
      break;
    }
    case "move": {
      message = await moveHandler(request);
      break;
    }
    case "created in popup": {
      message = await createFromPopupHandler(request);
    }
  }
  sendResponse(message);
};

async function createFromPopupHandler(request) {
  await bookmarkAdded();
  return { farewell: "bk updated" };
}
async function createHandler(request) {
  const { bookmark } = request; //updated bookmark id
  //check if it belongs to the selected workspace
  const bks = getState1("bookmarks.bks");
  const inside = getChildren(bks, bookmark.parentId);
  //if parent found, then update the workspace bookmark tree
  if (inside) {
    if (bookmark.url) {
      //isExist == true, bk created via popup,and msg recevied here send by onCreate
      const isExist = await isBookmarkExistInStorage(bookmark.id);
      if (!isExist) {
        const tags = extractTagsFromBookmarkName(bookmark.title);
        if (tags.length > 0) {
          //means bookmark created in bookmark bar with '##', we can only deal with it after its creation, unlike
          //those are created in popup or easy board
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
      } else {
        await bookmarkAdded();
        return { farewell: "do nothing" };
      }
    }
    await bookmarkAdded();
    return { farewell: "workspace bookmarks updated" };
  } else {
    return { farewell: "do nothing" };
  }
}

async function deleteHandler(request) {
  const { id } = request;
  const bks = getState1("bookmarks.bks");
  const isSelectedNodeId = getState1("bookmarks.isSelected");

  //if workspace folder get deleted
  if (id == bks.id) {
    //clear localStorage,and reload the app
    await chrome.storage.sync.clear();
    window.location.reload();
  } else {
    const removedBookmark = getChildren(bks, id);

    if (removedBookmark) {
      if (
        id == isSelectedNodeId ||
        getChildren(getChildren(bks, id), isSelectedNodeId)
      ) {
        //if the current selected folder or its parent is deleted, then show the root
        setState1("bookmarks.isSelected", bks.id);
      }
      await bookmarkAdded();
      await removeBookmarkTags([removedBookmark]);
      return { farewell: "workspace bookmarks updated" };
    } else {
      return { farewell: "do nothing" };
    }
  }
}

async function changeHandler(request) {
  const { id, changeInfo } = request;
  const { title, url } = changeInfo;
  const bks = getState1("bookmarks.bks");
  const changedBookmark = getChildren(bks, id);
  if (changedBookmark) {
    const tags = extractTagsFromBookmarkName(title);
    if (url && tags.length > 0) {
      //bookmark name changed with '##' in chrome bookmark bar
      const titleWithoutTags = extractTitle(title);
      await updateBookmark({ id, title: titleWithoutTags, url });
      console.log(`call saveTags with operation = xxx, tags = `, tags);
      await saveTags({ id, title: titleWithoutTags, url }, tags, "xxx");
    }
    await bookmarkAdded();
    return { farewell: "workspace bookmarks updated" };
  } else {
    return { farewell: "do nothing" };
  }
}

async function moveHandler(request) {
  const { id, moveInfo } = request;
  const { parentId, oldParentId } = moveInfo;
  const bks = getState1("bookmarks.bks");
  const moveIn = getChildren(bks, parentId) ? true : null;
  const moveOut = getChildren(bks, oldParentId) ? true : null;
  const [bookmark] = await getBookmarksByID(id);

  //check if the new parentId or old parentId belongs to the workspace
  let farewell = { farewell: "workspace bookmarks updated" };
  if (moveIn && moveOut) {
    //bookmark moved inside workspace
    await bookmarkAdded();
  } else if (moveIn && !moveOut) {
    if (bookmark.url) {
      const tags = extractTagsFromBookmarkName(bookmark.title);
      const titleWithoutTags = extractTitle(bookmark.title);
      console.log(`call saveTags with operation = add, tags = `, tags);
      await saveTags(
        { id, title: titleWithoutTags, url: bookmark.url },
        tags,
        "add"
      );
      if (tags.length > 0) {
        await updateBookmark({
          id,
          title: titleWithoutTags,
          url: bookmark.url,
        });
      }
    } else {
      const [bkWithChildren] = await getSubtree(bookmark.id);
      const bookmarks = getBookmarks(bkWithChildren);
      for (const bk of bookmarks) {
        const tags = extractTagsFromBookmarkName(bk.title);
        if (tags.length > 0) {
          const titleWithoutTags = extractTitle(bk.title);
          await updateBookmark({
            id: bk.id,
            title: titleWithoutTags,
          });
          await saveTags({ id: bk.id, title: titleWithoutTags }, tags, "add");
        } else {
          await saveTags({ id: bk.id, title: bk.title }, tags, "add");
        }
      }
    }
    await bookmarkAdded();
  } else if (!moveIn && moveOut) {
    await bookmarkAdded();
    await removeBookmarkTags(await getSubtree(id));
  } else {
    farewell = { farewell: "do nothing" };
  }
  return farewell;
}

export const openExtensionTab = async (url) => {
  chrome.tabs.create({
    url: url,
  });
};
