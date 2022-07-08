import { Input, Button, Modal } from "../../../component/index.js";
import { setState1, getState1, register } from "../../../../state.js";
import { deleteTag } from "../../../utils/tag.js";

//action
async function onDeleteTag(tagName) {
  if (tagName) {
    const tags = await deleteTag(tagName);
    closeModal();
    setState1("tags.tags", tags);
  } else {
    closeModal();
  }
}
const closeModal = (e) => {
  setState1("tags.editBar.delete.deleting", false);
  //setState1("tags.editBar.current", null);
};

let ID;

const content = () => {
  const { deleting } = getState1("tags.editBar.delete");
  const _content = document.createElement("div");
  const tagInput = new Input({
    type: "text",
    value: deleting && deleting.title,
    style: { marginTop: "1rem" },
    disabled: true,
  });
  const delButton = Button({ label: "delete", style: { marginTop: "1rem" } });

  delButton.addEventListener("click", async () => {
    let tagName = tagInput.getValue().trim();
    await onDeleteTag(tagName);
  });

  _content.append(tagInput.create());
  _content.append(delButton);
  return Modal({
    title: "Delete Tag",
    id: "tag-delete-modal",
    content: _content,
    onClickOverlay: (e) => {
      closeModal(e);
    },
  });
};

const update = () => {
  document.getElementById(ID).innerHTML = "";
  create();
};

const create = () => {
  let popup;
  if (!(popup = document.getElementById(ID))) {
    popup = document.createElement("div");
    popup.id = ID = "tag-delete-modal-wrapper";
  }

  popup.append(content());

  const { deleting } = getState1("tags.editBar.delete");
  popup.style.display = deleting ? "block" : "none";
  return popup;
};

register("tags.editBar.delete.deleting", update);
const add = { create };

export default add;
