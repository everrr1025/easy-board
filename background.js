chrome.tabs.onCreated.addListener(() => {
  console.log(`new tab created`);
});

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  chrome.runtime.sendMessage(
    { id, bookmark, action: "create" },
    function (response) {
      console.log(response);
    }
  );
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  chrome.runtime.sendMessage(
    { id, removeInfo, action: "delete" },
    function (response) {
      console.log(response);
    }
  );
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  chrome.runtime.sendMessage(
    { id, changeInfo, action: "change" },
    function (response) {
      console.log(response);
    }
  );
});

chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
  chrome.runtime.sendMessage(
    { id, moveInfo, action: "move" },
    function (response) {
      console.log(response);
    }
  );
});
