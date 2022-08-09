import navigator from "./src/app/navigator/navigator.js";
import content from "./src/app/content/content.js";
import workspace from "./src/app/workspace/workspace.js";
import { getUserData, getSubtree } from "./src/app/utils/chrome.js";
import { setState1 } from "./src/state.js";
import setting from "./src/app/setting/setting.js";
function init() {
  getUserData(["easyBoard"]).then((userData) => {
    if (!(userData.easyBoard && userData.easyBoard.bookmarks.isSelected)) {
      document.getElementById("container").append(workspace.create());
    } else {
      //shoud update body style here since it doesn't belong to any component.
      const primaryColor = userData.easyBoard.setting.colorSetting.primaryColor;
      Object.assign(document.body.style, {
        color: primaryColor,
        backgroundColor: primaryColor,
      });

      const isSelectedNodeId = userData.easyBoard.bookmarks.isSelected.id;

      getSubtree(isSelectedNodeId).then((bkNodes) => {
        setState1("workspace.primaryColor", primaryColor);
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
