import navigator from "./app/navigator/navigator.js";
import content from "./app/content/content.js";
import workspace from "./app/workspace/workspace.js";
import { getUserData, getSubtree } from "./app/utils/chrome.js";
import { setState1 } from "../src/state.js";
import setting from "./app/setting/setting.js";
function init() {
  getUserData(["easyBoard"]).then((userData) => {
    if (!(userData.easyBoard && userData.easyBoard.bookmarks.isSelected)) {
      document.getElementById("container").append(workspace.create());
    } else {
      //shoud update body style here since it doesn't belong to any component.
      Object.assign(document.body.style, {
        color: userData.easyBoard.setting.colorSetting.primaryColor,
        backgroundColor: userData.easyBoard.setting.colorSetting.primaryColor,
      });

      const isSelectedNodeId = userData.easyBoard.bookmarks.isSelected.id;

      getSubtree(isSelectedNodeId).then((bkNodes) => {
        setState1("bookmarks.bks", bkNodes[0]);
        setState1("bookmarks.path", [bkNodes[0]]);
        setState1("bookmarks.isSelected", isSelectedNodeId);
        setState1("workspace.isSelected", isSelectedNodeId);
        document.getElementById("container").append(navigator.create());
        document.getElementById("container").append(content.create());
        document.getElementById("container").append(setting.create());
      });
    }
  });
}

init();
