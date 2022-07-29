import { getState1, setState1 } from "../../state.js";
import { updateSettings } from "../utils/workspace.js";

const onColorInput = async (color) => {
  updateSettings(color);
  setState1("workspace.primaryColor", color);
  document.body.style.color = color;
  document.body.style.backgroundColor = color;
};

const update = () => {};

const create = () => {
  let view = document.createElement("div");
  const primaryColor = getState1("workspace.primaryColor");
  const colorPic = document.createElement("input");
  colorPic.type = "color";
  colorPic.value = primaryColor;
  view.append(colorPic);
  //   colorPic.addEventListener("change", async (e) => {}, false);
  colorPic.addEventListener(
    "change",
    async (e) => {
      await onColorInput(e.currentTarget.value);
    },
    false
  );
  return colorPic;
};

const setting = { create, update };

export default setting;
