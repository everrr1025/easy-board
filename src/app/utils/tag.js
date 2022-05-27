import { setUserData, getUserData } from "./chrome.js";

/**
 * module to handle tag opreation
 *
 */

export const createTag = ({ title }) => {
  return { title };
};

export const extractTags = (bookmarkName) => {
  let tags = [];
  const words = bookmarkName.split("##");
  words.splice(0, 1); //skip the real bookmark name
  tags = words
    .filter((tag) => tag)
    .map((tag) => {
      return { title: tag.trim() };
    });
  return tags;
};

export const extractTitle = (bookmarkName) => {
  const words = bookmarkName.split("##");
  return words[0];
};

export async function saveTags(bookmarkId, tags, operation) {
  const toUpdateTags = [];
  const toUpdateBookmarkTags = [];
  for (const tag of tags) {
    const tagObj = createTag(tag);
    toUpdateBookmarkTags.push(tagObj);

    //should add bookmark in to the tags while update tags in storage
    const tagObjCopy = { ...tagObj };
    tagObjCopy.bookmarks = [];
    tagObjCopy.bookmarks.push(bookmarkId);
    toUpdateTags.push(tagObjCopy);
  }
  if (operation == "add") {
    await addTagsInStorage(toUpdateTags);
  } else if (operation == "edit") {
    await updateTagsInStorage(bookmarkId, toUpdateTags);
  }
  await addBookmarksWithTagsInStorage(bookmarkId, toUpdateBookmarkTags);
}

async function addTagsInStorage(tags) {
  const storage = await getUserData(["tags"]);
  const tagsMap = new Map(JSON.parse(storage.tags));
  for (const tag of tags) {
    if (tagsMap.has(tag.title)) {
      const tagInStorage = tagsMap.get(tag.title);
      tag.bookmarks = tag.bookmarks.concat(tagInStorage.bookmarks);
    }
    tagsMap.set(tag.title, tag);
  }
  return await setUserData({ tags: JSON.stringify([...tagsMap]) });
}

export async function getTags(bookmarkId) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  return bookmarkTagsMap.get(bookmarkId);
}
async function updateTagsInStorage(bookmarkId, inTags) {
  const { bookmarkTags, tags } = await getUserData(["bookmarkTags", "tags"]);
  const tagsMap = new Map(JSON.parse(tags));
  const bookmarkTagsMap = new Map(JSON.parse(bookmarkTags));

  const bookmarkOldTags = bookmarkTagsMap.get(bookmarkId);
  const combined = bookmarkOldTags.concat([]);

  for (const tag of inTags) {
    let alreadyHas = false;
    for (const oldTag of bookmarkOldTags) {
      if (tag.title == oldTag.title) {
        alreadyHas = true;
      }
    }
    if (!alreadyHas) {
      combined.push(tag);
    }
  }

  for (const tag of combined) {
    const foundInBookmarkTags = bookmarkOldTags.find(
      (item) => item.title == tag.title
    );
    const foundInTags = inTags.find((item) => item.title == tag.title);
    if (foundInBookmarkTags && foundInTags) {
      //do nothing
    } else if (foundInBookmarkTags && !foundInTags) {
      const tagInMap = tagsMap.get(tag.title);
      tagInMap.bookmarks.splice(tagInMap.bookmarks.indexOf(bookmarkId), 1);
      tagsMap.set(tag.title, tagInMap);
    } else if (!foundInBookmarkTags && foundInTags) {
      if (tagsMap.has(tag.title)) {
        const tagInStorage = tagsMap.get(tag.title);
        tag.bookmarks = tag.bookmarks.concat(tagInStorage.bookmarks);
      }
      tagsMap.set(tag.title, tag);
    }
  }

  return await setUserData({ tags: JSON.stringify([...tagsMap]) });
}
async function addBookmarksWithTagsInStorage(bookmarkId, tags) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  bookmarkTagsMap.set(bookmarkId, tags);

  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });
}

export async function deleteTags(bookmarkId) {
  await removeTagsInStorage(bookmarkId);
  await removeBookmarksWithTagsInStorage(bookmarkId);
}

async function removeTagsInStorage(bookmarkId) {
  const { bookmarkTags, tags } = await getUserData(["bookmarkTags", "tags"]);
  const bookmarkTagsMap = new Map(JSON.parse(bookmarkTags));
  const tagsMap = new Map(JSON.parse(tags));
  const theDeletedBookmarkTags = bookmarkTagsMap.get(bookmarkId);
  for (const tag of theDeletedBookmarkTags) {
    if (tagsMap.has(tag.title)) {
      const tagInMap = tagsMap.get(tag.title);
      tagInMap.bookmarks.splice(tagInMap.bookmarks.indexOf(bookmarkId), 1);

      tagsMap.set(tag.title, tagInMap);
    }
  }
  return await setUserData({
    tags: JSON.stringify([...tagsMap]),
  });
}

async function removeBookmarksWithTagsInStorage(bookmarkId) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  bookmarkTagsMap.delete(bookmarkId);

  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });
}
