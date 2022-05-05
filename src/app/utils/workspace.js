import { createBookmark } from "../utils/chrome.js";
import { setUserData } from "./chrome.js";

//return promise
export async function createWorkspace({ name, isSync }) {
  if (isSync) {
    const ws = await createBookmark({ title: name, parentId: "1" });
    if (ws) {
      const a = await setUserData({
        easyDashboard: { bookmarks: { isSelected: ws } },
      });
    }

    return ws;
  } else {
  }
}
