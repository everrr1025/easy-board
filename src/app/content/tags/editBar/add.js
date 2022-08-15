import { Input, Button, Modal } from "../../../component/index.js";
import { setState1, getState1, register } from "../../../../state.js";
import { createNewTag, extractTagsFromTagInput } from "../../../utils/tag.js";

//action
async function addTag(tagName) {
  if (tagName.trim()) {
    const tags = await createNewTag(extractTagsFromTagInput(tagName));
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
    id: "add-tag-name",
    inputStyle: { color: primaryColor, border: `1px solid ${primaryColor}` },
    onInput: (e) => {},
    placeholder: "use '##' to add multiple tags at once",
  });
  const addButton = Button({
    label: "add",
    style: { marginTop: "1rem", border: `1px solid ${primaryColor}` },
  });

  addButton.addEventListener("click", async () => {
    let tagName = tagInput.getValue().trim();
    await addTag(tagName);
  });

  _content.append(tagInput.create());
  _content.append(addButton);
  setTimeout(() => document.getElementById("add-tag-name").focus(), 0);
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
