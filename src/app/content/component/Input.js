import { styleHyphenFormat } from "../../utils/utils.js";

/**
 * pure component - input with label
 */
const STYLE = {
  display: "flex",
  flexDirection: "column",
  margin: "0.5rem 0",
};
const INPUT_STYLE = {
  marginTop: "0.25rem",
  height: "1.5rem",
};

const Input = (details) => {
  const { label, id, value, disabled } = details;

  const view = document.createElement("div");
  const _label = document.createElement("label");
  const _input = document.createElement("input");
  _label.innerText = label;
  _input.id = id;
  _input.value = value;
  _input.disabled = disabled;
  view.append(_label);
  view.append(_input);
  Object.assign(_input.style, styleHyphenFormat(INPUT_STYLE));
  Object.assign(view.style, styleHyphenFormat(STYLE));
  return view;
};

export default Input;
