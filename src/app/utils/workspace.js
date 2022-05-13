import { createBookmark } from "../utils/chrome.js";
import { setUserData } from "./chrome.js";

//return promise
async function createWorkspace({ name, isSync }) {
  if (isSync) {
    const ws = await createBookmark({ title: name, parentId: "1" });
    if (ws) {
      const a = await setUserData({
        easyDashboard: { bookmarks: { isSelected: ws } },
      });
    }
    return ws;
  } else {
    //create the root node
    const root = createNode({ title });
    return await setUserData({
      KEY: { bookmarks: { isSelected: root, nodes: root } },
    });
  }
}

/* const workspace = {
  bookmarks: {
    isSelected: {},
    nodes: {
      id,
      parentId,
      children: [],
    },
  },
}; */

const workspace = {};

const KEY = "easyDashborad";
const ID = 0;

const createNode = ({ parentId, title, url }) => {
  const dateAdded = Date.now();
  if (!parentId) {
    //create the root
    return {
      id: "1",
      index: 0,
      title,
      children: [],
      dateAdded,
      dateGroupModified: dateAdded,
    };
  }

  return {};
};

export { createWorkspace };
