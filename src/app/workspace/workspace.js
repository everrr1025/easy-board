import { Modal, Input, Button } from "../component/index.js";
import { createWorkspace } from "../utils/workspace.js";
import { getState1 } from "../../state.js";
//const COLORSETTINGS = await getColorSettings();
async function onClickCreate(e, details) {
  await createWorkspace(details);
  window.location.reload();
}
const update = () => {};

const content = () => {
  const primaryColor = getState1("workspace.primaryColor");
  const _content = document.createElement("div");

  const _workspaceName = new Input({
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
    style: { marginTop: "1rem", borderColor: primaryColor },
  });
  _createButton.addEventListener("click", async (e) => {
    await onClickCreate(e, { name: _workspaceName.getValue(), isSync: true });
  });

  _content.append(_workspaceName.create());
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
