import { Input, Button, Modal } from "../../../component/index.js";
import { setState1, getState1, register } from "../../../../state.js";
import { editTag } from "../../../utils/tag.js";

let ID;

async function onEditTag(newTagName) {
  const editingTag = getState1("tags.editBar.edit.editing");
  const tags = await editTag(editingTag, newTagName);
  setState1("tags.tags", tags);
  closeModal();
}

const closeModal = (e) => {
  setState1("tags.editBar.edit.editing", false);
  //setState1("tags.editBar.current", null);
};
const update = () => {
  document.getElementById(ID).innerHTML = "";
  create();
};

const content = () => {
  const { editing } = getState1("tags.editBar.edit");
  const _content = document.createElement("div");
  const tagInput = new Input({
    type: "text",
    value: editing && editing.title,
    style: { marginTop: "1rem" },
  });
  const editButton = Button({ label: "edit", style: { marginTop: "1rem" } });

  editButton.addEventListener("click", async () => {
    let tagName = tagInput.getValue().trim();

    await onEditTag(tagName);
  });

  _content.append(tagInput.create());
  _content.append(editButton);
  return Modal({
    title: "Edit Tag",
    id: "tag-edit-modal",
    content: _content,
    onClickOverlay: (e) => {
      closeModal(e);
    },
  });
};
const create = () => {
  let popup;
  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "tag-edit-modal-wrapper";
  }

  popup.append(content());

  const { editing } = getState1("tags.editBar.edit");
  popup.style.display = editing ? "block" : "none";
  return popup;
};

register("tags.editBar.edit.editing", update);
const edit = { create };

export default edit;
