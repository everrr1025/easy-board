import { getState1, setState1 } from "../../state.js";
import { createBookmark, getSubtree } from "../utils/chrome.js";
import { setUserData, getUserData } from "./chrome.js";
import { getBookmarks } from "./utils.js";
import { saveTags } from "./tag.js";

//return promise
async function createWorkspace({ name, isSync }) {
  const userData = await getUserData(["easyBoard"]);
  const xxx = await getSubtree("1");
  const folders = xxx[0].children.filter((bk) => !bk.url);
  const found = folders.find((folder) => folder.title.trim() == name.trim());
  if (!userData.easyBoard && !found) {
    const ws = await createBookmark({ title: name, parentId: "1" }); //create workspace
    if (ws) {
      await setUserData({
        easyBoard: {
          bookmarks: { isSelected: { id: ws.id } },
          setting: {
            colorSetting: {
              primaryColor: "#00224d",
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
  } else if (found) {
    await setUserData({
      easyBoard: {
        bookmarks: { isSelected: { id: found.id } },
        setting: {
          colorSetting: {
            primaryColor: "#00224d",
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
    const yy = getBookmarks(found);
    for (const bk of yy) {
      await saveTags(bk, [], "add");
    }
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
