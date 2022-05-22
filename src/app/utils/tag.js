import { setUserData, getUserData } from "./chrome.js";

/**
 * module to handle tag opreation
 *
 */

export const createTag = ({ title }) => {
  const id = Date.now();
  return { title, id };
};

export const extractTags = (bookmarkName) => {
  let tags = [];
  const words = bookmarkName.split("##");
  words.splice(0, 1); //skip the real bookmark name
  tags = words.filter((tag) => tag).map((tag) => tag.trim());
  return tags;
};

export const extractTitle = (bookmarkName) => {
  const words = bookmarkName.split("##");
  return words[0];
};

export async function saveTags(bookmarkId, tags) {
  const tagsToUpdate = [];
  for (const tag of tags) {
    const tagObj = createTag({ title: tag });
    tagsToUpdate.push(tagObj);
  }
  await updateTagsInStorage(tagsToUpdate);
  await updateBookmarksInStorage(bookmarkId, tagsToUpdate);
}

export async function getTags(bookmarkId) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  return bookmarkTagsMap.get(bookmarkId);
}
async function updateTagsInStorage(tags) {
  const tagsInStorage = await getUserData(["tags"]); //Map
  const tagsMap = new Map(JSON.parse(tagsInStorage.tags));
  for (const tag of tags) {
    if (!tagsMap.has(tag.title)) {
      tagsMap.set(tag.title, tag);
    }
  }
  return await setUserData({ tags: JSON.stringify([...tagsMap]) });
}
async function updateBookmarksInStorage(bookmarkId, tags) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  bookmarkTagsMap.set(bookmarkId, tags);

  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });
}
