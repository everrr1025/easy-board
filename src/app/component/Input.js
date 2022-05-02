import { styleHyphenFormat } from "../utils/utils.js";

/**
 * pure component - input with label
 */
const STYLE = {
  display: "flex",
  flexDirection: "column",
  // margin: "0.5rem 0",
};
const INPUT_STYLE = {
  marginTop: "0.25rem",
  height: "1.5rem",
};

// const Input = (details) => {
//   const { type, label, id, value, disabled, style } = details;

//   const view = document.createElement("div");
//   const _label = document.createElement("label");
//   const _input = document.createElement("input");
//   _label.innerText = label ?? "";
//   _input.id = id ?? "";
//   _input.type = type ?? "text";
//   _input.value = value ?? "";
//   _input.disabled = disabled ?? "";
//   view.append(_label);
//   view.append(_input);
//   Object.assign(_input.style, styleHyphenFormat(INPUT_STYLE));
//   Object.assign(view.style, styleHyphenFormat(STYLE));
//   style && Object.assign(view.style, styleHyphenFormat(style));

//   return view;
// };

function Input(details) {
  //const { type, label, id, value, disabled, style } = details;
  const { id, value } = details;

  this.id = id ?? "";
  this.value = value ?? "";
  this.getValue = () => {
    return this.value;
  };

  this.create = () => {
    const { type, label, id, value, disabled, style } = details;

    const view = document.createElement("div");
    const _label = document.createElement("label");
    const _input = document.createElement("input");
    _label.innerText = label ?? "";
    _input.id = id ?? "";
    _input.type = type ?? "text";
    _input.value = value ?? "";
    _input.disabled = disabled ?? "";
    _input.addEventListener("change", (e) => {
      this.value = e.target.value;
    });
    view.append(_label);
    view.append(_input);
    Object.assign(_input.style, styleHyphenFormat(INPUT_STYLE));
    Object.assign(view.style, styleHyphenFormat(STYLE));
    style && Object.assign(view.style, styleHyphenFormat(style));
    return view;
  };
}

export default Input;
