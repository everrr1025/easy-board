/**
 * module to encapsulate chrome extension API
 */
const FOLDER = "pinecone"; //the default folder to query bookmarks

export async function getBookmarks(folder) {
  const search = folder ? folder : FOLDER;
  let nodes = await chrome.bookmarks.search(search);
  let node = nodes.filter((bookmark) => !bookmark.url)[0]; //suppose the 1st one that matched
  let xx = await chrome.bookmarks.getSubTree(node.id);
  return xx[0];
}

export async function getBookmarksByID(nodeId) {
  let node = await chrome.bookmarks.get(nodeId);
  return node;
}

export async function createBookmark(details, cb) {
  let node = await chrome.bookmarks.create(details);
  return node;
}

export async function updateBookmark(details) {
  const { id, url, title } = details;

  return await chrome.bookmarks.update(id, { url, title });
}

export async function removeBookmark(details) {
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
