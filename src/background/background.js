import { getUserData } from "../app/utils/chrome.js";
import { shouldSyncStorage } from "./utils.js";

import {
  addBookmarkInStorage,
  removeBookmarkInStorage,
  isEasyBoardTabsOpen,
} from "./utils.js";

chrome.tabs.onCreated.addListener(() => {
  console.log(`new tab created`);
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

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  chrome.runtime.sendMessage(
    { id, changeInfo, action: "change" },
    function (response) {
      console.log(response.farewell);
    }
  );
});

chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
  chrome.runtime.sendMessage(
    { id, moveInfo, action: "move" },
    function (response) {
      console.log(response.farewell);
    }
  );
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
  }
};

const createHandler = async (details) => {
  const { id, bookmark } = details;
  const shoudSync = await shouldSyncStorage(bookmark, "create");
  if (shoudSync) {
    await addBookmarkInStorage(bookmark, []);
  } else {
    //do nothing
  }
};

const deleteHandler = async (details) => {
  const { id, removeInfo } = details;
  const isWS = await isWorkspace(id);

  if (isWS) {
    await chrome.storage.sync.clear();
  } else if (await shouldSyncStorage(removeInfo.node, "remove")) {
    await removeBookmarkInStorage(removeInfo.node);
  } else {
    //do nothing
  }
};

const isWorkspace = async (id) => {
  const userData = await getUserData(["easyBoard"]);
  const wsId = userData.easyBoard.bookmarks.isSelected.id;
  return id == wsId ? true : false;
};
