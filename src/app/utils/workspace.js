import { getState1, setState1 } from "../../state.js";
import { createBookmark } from "../utils/chrome.js";
import { setUserData, getUserData } from "./chrome.js";

//return promise
async function createWorkspace({ name, isSync }) {
  if (isSync) {
    const ws = await createBookmark({ title: name, parentId: "1" }); //create workspace
    if (ws) {
      await setUserData({
        easyBoard: {
          bookmarks: { isSelected: ws },
          setting: {
            colorSetting: {
              primaryColor: "#ffffff",
            },
          },
        },
      });
      await setUserData({
        tags: JSON.stringify([...new Map()]),
      });
      await setUserData({
        bookmarkTags: JSON.stringify([...new Map()]),
      });
    }
  } else {
  }
}

const getColorSettings = async () => {
  let x = getState1("workspace.primaryColor");
  if (!x) {
    const storage = await getUserData("easyBoard");
    x = storage.easyBoard.setting.colorSetting.primaryColor;
    setState1("workspace.primaryColor", x);
  }
  return { primaryColor: x };
};

const updateSettings = async (color) => {
  const storage = await getUserData("easyBoard");
  storage.easyBoard.setting.colorSetting.primaryColor = color;
  await setUserData({ easyBoard: storage.easyBoard });
};

// //put all the logic for theme applying here, much more straightforward then component udpate callback
// const applyTheme = () => {
//   const cols = document.getElementsByClassName("eb-theme");
//   const primaryColor = getState1("workspace.primaryColor");
//   for (let i = 0; i < cols.length; i++) {
//     if (cols[i].id == "navigation ") {
//     } else if (cols[i].id == "content") {
//       cols[i].style.borderColor = primaryColor;
//     } else if (cols[i].dataCategory == "bookmark") {
//       cols[i].style.borderColor = primaryColor;
//     } else {
//       cols[i].style.backgroundColor = primaryColor;
//       cols[i].style.borderColor = primaryColor;
//       cols[i].style.color = primaryColor;
//     }
//   }
// };

export { createWorkspace, getColorSettings, updateSettings };
