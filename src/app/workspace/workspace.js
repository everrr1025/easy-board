import { Modal, Input, Button } from "../component/index.js";
import { createWorkspace, getColorSettings } from "../utils/workspace.js";

const COLORSETTINGS = await getColorSettings();
async function onClickCreate(e, details) {
  await createWorkspace(details);
  window.location.reload();
}
const update = () => {};

const content = () => {
  const _content = document.createElement("div");

  const _workspace = new Input({
    label: "",
    style: { marginTop: "1rem" },
  });

  // const _isSync = new Input({
  //   label: "Sync with Chrome",
  //   type: "checkbox",
  //   labelFirst: true,
  //   checked: true,
  //   style: { marginTop: "1rem" },
  // }).create();

  const _createButton = Button({
    label: "create",
    style: { marginTop: "1rem", borderColor: COLORSETTINGS.primaryColor },
  });
  _createButton.addEventListener("click", async (e) => {
    await onClickCreate(e, { name: _workspace.getValue(), isSync: true });
  });

  _content.append(_workspace.create());
  //_content.append(_isSync);
  _content.append(_createButton);

  return Modal({
    title: "Create your workspace",
    content: _content,
    onClickOverlay: () => {
      return;
    },
  });
};

const create = () => {
  let view = document.createElement("div");
  view.append(content());
  return view;
};

const workspace = { create, update };

export default workspace;
