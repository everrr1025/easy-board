import { Input, Button, Modal } from "../../../component/index.js";
import { getColorSettings } from "../../../utils/workspace.js";
import { setState1, getState1, register } from "../../../../state.js";
import { createNewTag } from "../../../utils/tag.js";

const COLORSETTINGS = await getColorSettings();
//action
async function addTag(tagName) {
  if (tagName) {
    const tags = await createNewTag(tagName);
    closeModal();
    setState1("tags.tags", tags);
  } else {
    closeModal();
  }
}
const closeModal = (e) => {
  setState1("tags.editBar.add.active", false);
  setState1("tags.editBar.current", null);
};

let ID;

const content = () => {
  const primaryColor = getState1("workspace.primaryColor");
  const _content = document.createElement("div");
  const tagInput = new Input({
    type: "text",
    style: { marginTop: "1rem" },
    inputStyle: { color: primaryColor, borderColor: primaryColor },
    onInput: (e) => {},
  });
  const addButton = Button({
    label: "add",
    style: { marginTop: "1rem", borderColor: primaryColor },
  });

  addButton.addEventListener("click", async () => {
    let tagName = tagInput.getValue().trim();
    await addTag(tagName);
  });

  _content.append(tagInput.create());
  _content.append(addButton);
  return Modal({
    title: "Add Tag",
    id: "tag-add-modal",
    content: _content,
    onClickOverlay: (e) => {
      closeModal(e);
    },
  });
};

const update = () => {
  if (document.getElementById(ID)) {
    document.getElementById(ID).innerHTML = "";
  }
  create();
};

const create = () => {
  let popup;
  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "tag-add-modal-wrapper";
  }

  if (getState1("tags.editBar.add.active")) {
    popup.append(content());
  }
  return popup;
};

register("tags.editBar.add.active", update);
const add = { create };

export default add;
