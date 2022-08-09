/**
 * utils for background
 */

export async function setUserData(obj) {
  return await chrome.storage.sync.set(obj);
}

export async function getUserData(key) {
  return await chrome.storage.sync.get(key);
}

/**
 *
 * @param {*} bookmark - chrome bookmakr node
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

export const isEasyBoardTabsOpen = async () => {
  const x = await sendMessagePromise({ action: "isEasyBoardTabsOpen" });

  return x.result;
};

function sendMessagePromise(details) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(details, (response) => {
      if (response) {
        resolve(response);
      } else {
        resolve({ result: false });
      }
    });
  }).catch((error) => {
    //do nothing
  });
}
