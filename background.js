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
