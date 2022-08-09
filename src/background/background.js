import { setUserData, getUserData } from "../app/utils/chrome.js";
import { getChildren } from "../app/utils/utils.js";

import { addBookmarkInStorage, isEasyBoardTabsOpen } from "./utils.js";

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
  chrome.runtime.sendMessage(
    { id, removeInfo, action: "delete" },
    function (response) {
      response && console.log(response.farewell);
    }
  );
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
  }
};

const createHandler = async (details) => {
  const { id, bookmark } = details;
  const isIn = await isInside(id);
  if (isIn) {
    await addBookmarkInStorage(bookmark, []);
  } else {
    //do nothing
  }
};

const isInside = async (id) => {
  const userData = await getUserData(["easyBoard"]);
  const wsId = userData.easyBoard.bookmarks.isSelected.id;
  const sub = await chrome.bookmarks.getSubTree(wsId);
  const xx = getChildren(sub[0], id);

  return xx ? true : false;
};
