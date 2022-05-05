// chrome.runtime.onInstalled.addListener((reason) => {
//   if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
//     chrome.tabs.create({
//       url: "onboarding.html",
//     });
//   }
// });

chrome.tabs.onCreated.addListener(() => {
  console.log(`new tab created`);
});

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  chrome.runtime.sendMessage({ id, bookmark }, function (response) {
    console.log(response);
  });
});
