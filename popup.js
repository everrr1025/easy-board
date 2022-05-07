import { createBookmark, getUserData } from "./src/app/utils/chrome.js";

document.getElementById("add").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let userData = await getUserData(["easyDashboard"]);
  const wsId = userData.easyDashboard.bookmarks.isSelected.id;
  await createBookmark({ url: tab.url, title: tab.title, parentId: wsId });
});
