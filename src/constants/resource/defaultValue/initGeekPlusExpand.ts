import * as fs from "fs";
import * as path from "path";
import store from "../../store";

export default function initGeekPlusExpand() {
  const { geekplusExpandPath, fsPath } = store.getState(["geekplusExpandPath", "fsPath"]);
  const geekplusExpandConfigUrl = path.join(geekplusExpandPath, "/config.json");
  const geekplusExpandResourceUrl = path.join(geekplusExpandPath, "/resource");
  const geekplusExpandCacheUrl = path.join(geekplusExpandPath, "/cache");
  const vscodeFiles = path.join(fsPath, "/.vscode");

  // 检查是否存在.vscode目录 没有则创建
  try {
    fs.accessSync(vscodeFiles, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(vscodeFiles);
  }

  // 检查配置文件是否存在, 不存在则创建
  try {
    fs.accessSync(geekplusExpandPath, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(geekplusExpandPath);
  }

  // 检查 /config.json, 不存在则创建
  try {
    fs.accessSync(geekplusExpandConfigUrl, fs.constants.W_OK);
  } catch (error) {
    fs.writeFileSync(geekplusExpandConfigUrl, "{}", "utf-8");
  }

  // 检查 /resource, 不存在则创建
  try {
    fs.accessSync(geekplusExpandResourceUrl, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(geekplusExpandResourceUrl);
  }

  // 检查 /cache, 不存在则创建, 存在则清空文件夹
  try {
    fs.accessSync(geekplusExpandCacheUrl, fs.constants.W_OK);
    fs.rmdirSync(geekplusExpandCacheUrl, { recursive: true });
  } catch (error) {}
  fs.mkdirSync(geekplusExpandCacheUrl);

  // 检查是否存在 .gitignore 文件, 如果存在则将 .geekplusExpand 加入忽略项
  // TODO: 目录转移 不再对gitignore文件进行操作
  // try {
  //   fs.accessSync(geekplusExpandGitignoreUrl, fs.constants.W_OK);
  //   const gitignoreContent = fs.readFileSync(geekplusExpandGitignoreUrl, 'utf-8');
  //   if (!gitignoreContent.includes(".geekplusExpand")) {
  //     fs.appendFileSync(geekplusExpandGitignoreUrl, "\r\n.geekplusExpand");
  //   }
  // } catch (error) {}
}