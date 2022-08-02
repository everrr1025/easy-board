import {
  createTag,
  extractTagsFromBookmarkName,
} from "../src/app/utils/tag.js";

const createTagTest = () => {
  const tag = createTag({ title: "react" });
  let passed = false;
  if (tag.title === "react" && tag.id) {
    passed = true;
  }
  console.log(`createTag() test passed --- ${passed}`);
};

const extractTagsTest = () => {
  let passed = false;
  const bookmarkName = "react tutorial ##react##js ##frontend";
  const tags = extractTagsFromBookmarkName(bookmarkName);
  if (tags[0] == "react" && tags[1] === "js" && tags[2] === "frontend") {
    passed = true;
  }
  console.log(`extractTagsFromBookmarkName() test passed --- ${passed}`);
};
export const tagTest = () => {
  console.log(`tag test suite start \n`);
  createTagTest();
  extractTagsTest();
};
