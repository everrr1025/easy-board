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
export const removeBookmarkInStorage = async (bookmarkId) => {
  const storage = await getUserData(["bookmarkTags", "tags"]);
  const bookmarksMap = new Map(JSON.parse(storage.bookmarkTags));
  const tagsMap = new Map(JSON.parse(storage.tags));

  const bkTags = bookmarksMap.get(bookmarkId);
  for (const tag of bkTags) {
    if (tagsMap.has(tag.title)) {
      const tagInMap = tagsMap.get(tag.title);
      tagInMap.bookmarks.splice(tagInMap.bookmarks.indexOf(bookmarkId), 1);
      tagsMap.set(tag.title, tagInMap);
    }
  }
  bookmarksMap.delete(bookmarkId);
  return await setUserData({
    tags: JSON.stringify([...tagsMap]),
    bookmarkTags: JSON.stringify([...bookmarksMap]),
  });
};

export const isEasyBoardTabsOpen = async () => {
  const x = await sendMessagePromise({ action: "isEasyBoardTabsOpen" });

  return x.result;
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
