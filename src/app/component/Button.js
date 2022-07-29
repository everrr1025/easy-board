import { styleHyphenFormat } from "../utils/utils.js";
import { getColorSettings } from "../utils/workspace.js";

const STYLE = {
  border: "1px solid black",

  display: "inline-block",
  padding: "0.5rem",
  cursor: "pointer",
};

const Button = ({ label, style }) => {
  const view = document.createElement("div");

  view.innerText = label;
  Object.assign(view.style, styleHyphenFormat(STYLE));
  style && Object.assign(view.style, styleHyphenFormat(style)); //applay the passed in style
  return view;
};

export default Button;
