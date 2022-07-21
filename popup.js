import {
  createBookmark,
  getUserData,
  getSubtree,
} from "./src/app/utils/chrome.js";
import { getFolders, getFullPath } from "./src/app/utils/utils.js";
import { Select, Input } from "./src/app/component/index.js";
import { extractTags, extractTitle, saveTags } from "./src/app/utils/tag.js";

//check if workspace has been created.
let userData = await getUserData(["easyDashboard"]);
const createView = document.getElementById("createView");
const addView = document.getElementById("addView");

if (!userData.easyDashboard || !userData.easyDashboard.bookmarks) {
  createView.style.display = "flex";
  document.getElementById("create").addEventListener("click", async () => {
    await chrome.tabs.create({ active: true });
  });
} else {
  addView.style.display = "flex";
  const wsId = userData.easyDashboard.bookmarks.isSelected.id;

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
  document.getElementById("add").addEventListener("click", async () => {
    const createdBookmark = await createBookmark({
      url: tab.url,
      title: extractTitle(nameInput.getValue()),
      parentId: selectFolder.getValue(),
    });
    await saveTags(createdBookmark, extractTags(nameInput.getValue()), "add");
    window.close();
  });
}
