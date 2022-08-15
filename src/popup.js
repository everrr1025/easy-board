import { getUserData, getSubtree } from "./app/utils/chrome.js";
import { getFolders, getFullPath } from "./app/utils/utils.js";
import { Select, Input } from "./app/component/index.js";
import {
  extractTitle,
  saveTags,
  extractTagsFromBookmarkName,
} from "../src/app/utils/tag.js";

//check if workspace has been created.
let userData = await getUserData(["easyBoard"]);

const createView = document.getElementById("createView");
const addView = document.getElementById("addView");

if (!userData.easyBoard || !userData.easyBoard.bookmarks) {
  createView.style.display = "flex";
  document.getElementById("create").addEventListener("click", async () => {
    await chrome.tabs.create({ active: true });
  });
} else {
  addView.style.display = "flex";
  const wsId = userData.easyBoard.bookmarks.isSelected.id;

  //initialize title and folder
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const nameInput = new Input({
    type: "text",
    label: "Name",
    value: tab.title,
    style: { fontSize: "14px" },
  });

  document.getElementById("name").append(nameInput.create()); //set name

  let [bks] = await getSubtree(wsId);
  const folders = getFolders(bks);

  //generate select
  const selectWrapper = document.getElementById("folder");
  const options = [];

  for (const folder of folders) {
    const fullPath = getFullPath(bks, folder.id).reverse();
    if (fullPath.length > 0) {
      const title = fullPath.join(" / ");
      options.push({ value: folder.id, title });
    }
  }

  const selectFolder = new Select({
    label: "Folder",
    selected: "hongda",
    options: options,
    style: { fontSize: "14px" },
  });
  selectWrapper.append(selectFolder.create()); //set folder

  //onclick add

  const addButton = document.getElementById("add");
  const primaryColor = userData.easyBoard.setting.colorSetting.primaryColor;
  addButton.style.backgroundColor = primaryColor;
  addButton.addEventListener("click", async () => {
    const createdBookmark = await chrome.bookmarks.create({
      url: tab.url,
      parentId: selectFolder.getValue(),
      title: extractTitle(nameInput.getValue()),
    });
    await saveTags(
      createdBookmark,
      extractTagsFromBookmarkName(nameInput.getValue()),
      "add"
    );

    window.close();
  });
}
