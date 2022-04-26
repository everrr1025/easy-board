const LINK_STYLE = "#55624c";
const SETTINGS_PATH = "../../settings.json";
const URL =
  "https://qa-hcms-dev.jilinxiangyun.com/5c471262aa/feature-demo/pinecone-extension/18775d5762e8e956";

export async function getApps() {
  return await (await fetch(URL)).json();
}

export function createAppsView(apps) {
  let root = document.getElementById("app-view");
  apps.forEach((app) => {
    let appItem = document.createElement("div");
    appItem.className = "app-item";
    //icon
    let iconDiv = document.createElement("div");
    let iconImg = document.createElement("img");
    iconImg.src = app.favicon;
    iconDiv.className = "app-icon";
    iconDiv.append(iconImg);
    let linkDiv = document.createElement("div");
    let link = document.createElement("a");
    link.href = app.url;
    link.innerText = app.name;
    link.target = "_blank";
    link.style.color = LINK_STYLE;
    link.style.textDecoration = "none";
    linkDiv.style.textAlign = "center";
    linkDiv.append(link);
    appItem.append(iconDiv);
    appItem.append(linkDiv);
    root.append(appItem);
  });
}
