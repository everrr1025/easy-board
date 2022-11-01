import { setUserData, getUserData } from "./chrome.js";
import { getBookmarks } from "./utils.js";
import { LOG_ENABLED } from "../../constants.js";

/**
 * module to handle tag opreation
 *
 */

export const createTag = ({ title }) => {
  return { title };
};

export const extractTagsFromBookmarkName = (bookmarkName) => {
  let tags = [];
  const words = bookmarkName.split("##");

  words.splice(0, 1); //skip the real bookmark name

  tags = [...new Set(words)]
    .filter((tag) => tag)
    .map((tag) => {
      return { title: tag.trim() };
    });

  return tags;
};
/**
 * retrieve tags from input
 * ##web##china, web##china, will both retrieve 'web','china'
 * @param {*} input
 * @returns
 */
export const extractTagsFromTagInput = (input) => {
  let result = [];
  const tags = input.split("##");
  result = [...new Set(tags)].filter((tag) => tag); //remove duplicates and empty
  return result;
};

export const extractTitle = (bookmarkName) => {
  const words = bookmarkName.split("##");
  return words[0];
};

export async function createNewTag(tags) {
  const storage = await getUserData(["tags"]);
  const tagsMap = new Map(JSON.parse(storage.tags));
  for (const tag of tags) {
    !tagsMap.has(tag) && tagsMap.set(tag, { title: tag, bookmarks: [] });
  }
  await setUserData({ tags: JSON.stringify([...tagsMap]) });
  LOG_ENABLED && console.log(`[create new tag]`, tags, tagsMap);
  return tagsMap;
}

//save tags while bookmarks created with tags
export async function saveTags(bookmark, tags, operation) {
  const toUpdateTags = [];
  const toUpdateBookmarkTags = [];
  for (const tag of tags) {
    //const tagObj = createTag(tag);
    toUpdateBookmarkTags.push(tag);

    //should add bookmark in to the tags while update tags in storage
    const tagObjCopy = { ...tag };
    tagObjCopy.bookmarks = [];
    tagObjCopy.bookmarks.push(bookmark.id);
    toUpdateTags.push(tagObjCopy);
  }
  if (operation == "add") {
    await addTagsInStorage(toUpdateTags);
  } else if (operation == "edit") {
    await updateTagsInStorage(bookmark.id, toUpdateTags);
  }
  await addBookmarksWithTagsInStorage([bookmark], toUpdateBookmarkTags);
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

  LOG_ENABLED && console.log(`[add tags]:`, tags, `, tagsMap:`, tagsMap);
  return await setUserData({ tags: JSON.stringify([...tagsMap]) });
}

export async function getTags(bookmarkId) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  return bookmarkTagsMap.get(bookmarkId);
}
async function updateTagsInStorage(bookmarkId, inTags) {
  const { bookmarkTags, tags } = await getUserData(null);
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
  LOG_ENABLED && console.log(`[update tags]:`, inTags, `, tagsMap:`, tagsMap);
  return await setUserData({ tags: JSON.stringify([...tagsMap]) });
}
async function addBookmarksWithTagsInStorage(bookmarks, tags) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  for (const bk of bookmarks) {
    bookmarkTagsMap.set(bk.id, tags);
  }

  LOG_ENABLED &&
    console.log(
      `[update bookmarksWithTags]:`,
      `bookmarkTagsMap:`,
      bookmarkTagsMap
    );

  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });
}
//delete related tags while bookmark get deleted
export async function deleteTags(bookmarks) {
  await removeTagsInStorage(bookmarks);
  await removeBookmarksWithTagsInStorage(bookmarks);
}

async function removeTagsInStorage(bookmarks) {
  const { bookmarkTags, tags } = await getUserData(["bookmarkTags", "tags"]);
  const bookmarkTagsMap = new Map(JSON.parse(bookmarkTags));
  const tagsMap = new Map(JSON.parse(tags));
  for (const bk of bookmarks) {
    const theDeletedBookmarkTags = bookmarkTagsMap.get(bk.id);
    for (const tag of theDeletedBookmarkTags) {
      if (tagsMap.has(tag.title)) {
        const tagInMap = tagsMap.get(tag.title);
        tagInMap.bookmarks.splice(tagInMap.bookmarks.indexOf(bk.id), 1);
        tagsMap.set(tag.title, tagInMap);
      }
    }
  }
  LOG_ENABLED && console.log(`[remove tags]:`, `tagsMap:`, tagsMap);
  return await setUserData({
    tags: JSON.stringify([...tagsMap]),
  });
}

async function removeBookmarksWithTagsInStorage(bookmarks) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  for (const bk of bookmarks) {
    bookmarkTagsMap.delete(bk.id);
  }
  LOG_ENABLED &&
    console.log(`[remove bookmarksTags]:`, `bookmarkTagsMap:`, bookmarkTagsMap);
  return await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });
}

/**
 *
 * @param {name of tag to delete} tagName
 */
export async function deleteTag(tagName) {
  const { bookmarkTags, tags } = await getUserData(["bookmarkTags", "tags"]);
  const bookmarkTagsMap = new Map(JSON.parse(bookmarkTags));
  const tagsMap = new Map(JSON.parse(tags));
  const tagToDelete = tagsMap.get(tagName);
  //remove this tag from each bookmark's tag record
  for (const bookmarkId of tagToDelete.bookmarks) {
    let tags = bookmarkTagsMap.get(bookmarkId);
    tags = tags.filter((item) => item.title != tagName);
    bookmarkTagsMap.set(bookmarkId, tags);
  }
  //delete this tag from tags map
  tagsMap.delete(tagName);
  LOG_ENABLED && console.log(`[delete tag]:`, tagName, `, tagsMap:`, tagsMap);
  //sync with storage
  await setUserData({
    tags: JSON.stringify([...tagsMap]),
  });
  LOG_ENABLED &&
    console.log(
      `[delete tag]:`,
      tagName,
      `, bookmarkTagsMap:`,
      bookmarkTagsMap
    );
  await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });

  return tagsMap;
}

/**
 *
 * @param {*} editingTag
 * @param {*} newTagName
 */
export async function editTag(editingTag, newTagName) {
  const { bookmarkTags, tags } = await getUserData(["bookmarkTags", "tags"]);
  const bookmarkTagsMap = new Map(JSON.parse(bookmarkTags));
  const tagsMap = new Map(JSON.parse(tags));

  //remove the old tag，set the new one
  tagsMap.delete(editingTag.title);
  tagsMap.set(newTagName, {
    title: newTagName,
    bookmarks: editingTag.bookmarks,
  });

  //update bookmark's tag record
  for (const bookmarkId of editingTag.bookmarks) {
    let tags = bookmarkTagsMap.get(bookmarkId);
    tags = tags.filter((item) => item.title != editingTag.title);
    tags.push({ title: newTagName });
    bookmarkTagsMap.set(bookmarkId, tags);
  }
  LOG_ENABLED && console.log(`[edit tag]:`, newTagName, `, tagsMap:`, tagsMap);
  LOG_ENABLED &&
    console.log(
      `[edit tag]:`,
      newTagName,
      `, bookmarkTagsMap`,
      bookmarkTagsMap
    );
  //sync with storage
  await setUserData({
    tags: JSON.stringify([...tagsMap]),
  });
  await setUserData({
    bookmarkTags: JSON.stringify([...bookmarkTagsMap]),
  });
  return tagsMap;
}

export async function updateBookmarkTags(bookmark, tags) {
  const bk = bookmark[0];
  if (bk.url) {
    await addBookmarksWithTagsInStorage([bk], tags);
  } else {
    const xx = getBookmarks(bk);

    await addBookmarksWithTagsInStorage(xx, tags);
  }
}
export async function removeBookmarkTags(bookmark) {
  const bk = bookmark[0];
  if (bk.url) {
    await deleteTags([bk]);
  } else {
    const xx = getBookmarks(bk);

    await deleteTags(xx);
  }
}

export async function isBookmarkExistInStorage(bookmarkId) {
  const storage = await getUserData(["bookmarkTags"]); //Map
  const bookmarkTagsMap = new Map(JSON.parse(storage.bookmarkTags));
  const bkTags = bookmarkTagsMap.get(bookmarkId);
  return bkTags && bkTags.length > 0;
}

export async function xxx(bookmark) {
  if (bookmark.indexOf("##") < 0) return;
  const tags = extractTagsFromBookmarkName(bookmark.title);
}
