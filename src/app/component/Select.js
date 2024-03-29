import { styleHyphenFormat } from "../utils/utils.js";
import { getColorSettings } from "../utils/workspace.js";

//const COLORSETTING = await getColorSettings();
const STYLE = {
  display: "flex",
  flexDirection: "column",
  margin: "0.5rem 0",
};

const SELECT_STYLE = {
  marginTop: "0.25rem",
  height: "2rem",
  // border: `1px solid ${COLORSETTING.primaryColor}`,
  // color: COLORSETTING.primaryColor,
};

function Select(details) {
  const { id, selected, label, options, style, selectStyle } = details;
  this.id = id ?? "";
  this.select;

  this.getValue = () => {
    return this.select.value;
  };

  this.create = () => {
    const view = document.createElement("div");
    const _label = document.createElement("label");
    const _select = document.createElement("select");
    this.select = _select;

    _label.innerText = label;

    for (const option of options) {
      const { value, title } = option;
      const _option = document.createElement("option");
      _option.value = value;
      _option.innerText = title;
      if (selected == value) _option.selected = true;
      _select.append(_option);
    }
    view.append(_label);
    view.append(_select);
    Object.assign(_select.style, styleHyphenFormat(SELECT_STYLE));
    Object.assign(view.style, styleHyphenFormat(STYLE));
    selectStyle && Object.assign(_select.style, styleHyphenFormat(selectStyle));
    style && Object.assign(view.style, styleHyphenFormat(style));

    return view;
  };
}

export default Select;
