import { Modal, Input, Button } from "../component/index.js";
import { createWorkspace } from "../utils/workspace.js";
import { setState1 } from "../../state.js";

async function onClickCreate(e, details) {
  let ws = await createWorkspace(details);
  setState1("bookmarks.isSelected", ws);
}
const update = () => {};

const content = () => {
  const _content = document.createElement("div");

  const _workspace = new Input({ label: "Workspace" });

  const _isSync = new Input({
    label: "Sycn with Chrome",
    type: "checkbox",
    labelFirst: true,
    checked: true,
  }).create();

  const _createButton = Button({ label: "create" });
  _createButton.addEventListener("click", async (e) => {
    await onClickCreate(e, { name: _workspace.getValue(), isSync: true });
  });

  _content.append(_workspace.create());
  _content.append(_isSync);
  _content.append(_createButton);

  return Modal({ title: "Setting", content: _content });
};

const create = () => {
  let view = document.createElement("div");
  view.append(content());
  return view;
};

const setting = { create, update };

export default setting;
