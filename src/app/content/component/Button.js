import { styleHyphenFormat } from "../../utils/utils.js";

const STYLE = {
  border: "1px solid black",
  //boxSizing: "border-box",
  display: "inline-block",
  padding: "0.3rem",
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
