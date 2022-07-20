import { createBookmark } from "../utils/chrome.js";
import { setUserData } from "./chrome.js";

//return promise
async function createWorkspace({ name, isSync }) {
  if (isSync) {
    const ws = await createBookmark({ title: name, parentId: "1" }); //create workspace
    if (ws) {
      await setUserData({
        easyDashboard: {
          bookmarks: { isSelected: ws },
        },
      });
      await setUserData({
        tags: JSON.stringify([...new Map()]),
      });
      await setUserData({
        bookmarkTags: JSON.stringify([...new Map()]),
      });
    }
  } else {
  }
}

export { createWorkspace };
