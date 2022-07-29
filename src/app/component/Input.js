import { styleHyphenFormat } from "../utils/utils.js";
import { getColorSettings } from "../utils/workspace.js";

/**
 * pure component - input with label
 */

const COLORSETTING = await getColorSettings();
const STYLE = {
  display: "flex",
  flexDirection: "column",
  margin: "0.5rem 0",
};

const CHECKBOX_STYLE = {};
const TEXT_STYLE = {
  marginTop: "0.25rem",
  padding: "0 0 0 5px ",
  height: "2rem",
  fontSize: "14px",
  border: `1px solid ${COLORSETTING.primaryColor}`,
  color: COLORSETTING.primaryColor,
};

const createCheckbox = (details) => {
  const { label, style, checked, labelFirst, onClick } = details;

  const view = document.createElement("div");
  const _label = document.createElement("label");
  const _input = document.createElement("input");
  _input.type = "checkbox";

  _input.checked = checked;
  _input.style.verticalAlign = "text-top";

  if (labelFirst) {
    _label.append(document.createTextNode(label ?? ""));
    _label.append(_input);
  } else {
    _label.append(_input);
    _label.append(document.createTextNode(label ?? ""));
  }
  view.append(_label);
  _input.addEventListener("change", (e) => {
    onClick(e, !checked);
  });

  Object.assign(view.style, styleHyphenFormat(CHECKBOX_STYLE));
  if (style) {
    Object.assign(view.style, styleHyphenFormat(style));
  }
  return view;
};

function Input(details) {
  const { id, value, type } = details;
  this.id = id ?? "";
  this.value = value ?? "";
  this.type = type ?? "";
  this.getValue = () => {
    return this.value;
  };

  this.create = () => {
    const {
      type,
      label,
      id,
      value,
      disabled,
      inputStyle,
      style,
      onClick,
      onInput,
      checked,
      labelFirst,
    } = details;
    let view;
    if (type == "checkbox") {
      view = createCheckbox({
        label,
        style,
        checked,
        labelFirst,
        onClick,
      });
    } else {
      view = document.createElement("div");
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
      onInput &&
        _input.addEventListener("input", (e) => {
          onInput(e);
        });
      view.append(_label);
      view.append(_input);
      Object.assign(_input.style, styleHyphenFormat(TEXT_STYLE));
      Object.assign(view.style, styleHyphenFormat(STYLE));
      inputStyle && Object.assign(_input.style, styleHyphenFormat(inputStyle));
      style && Object.assign(view.style, styleHyphenFormat(style));
    }
    return view;
  };
}

export default Input;
