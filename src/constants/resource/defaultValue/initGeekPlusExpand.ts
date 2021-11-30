import * as fs from "fs";
import * as path from "path";
import store from "../../store";

export default function initGeekPlusExpand() {
  const fsPath = store.getState("fsPath");
  const geekplusExpandUrl = path.join(fsPath, "/.geekplusExpand");
  const geekplusExpandConfigUrl = path.join(fsPath, "/.geekplusExpand", "/config.json");
  const geekplusExpandResourceUrl = path.join(fsPath, "/.geekplusExpand", "/resource");
  const geekplusExpandCacheUrl = path.join(fsPath, "/.geekplusExpand", "/cache");
  const geekplusExpandGitignoreUrl = path.join(fsPath, "/.gitignore");

  // 检查 .geekplusExpand 是否存在, 不存在则创建
  try {
    fs.accessSync(geekplusExpandUrl, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(geekplusExpandUrl);
  }

  // 检查 .geekplusExpand/config.json, 不存在则创建
  try {
    fs.accessSync(geekplusExpandConfigUrl, fs.constants.W_OK);
  } catch (error) {
    fs.writeFileSync(geekplusExpandConfigUrl, "{}", "utf-8");
  }

  // 检查 .geekplusExpand/resource, 不存在则创建
  try {
    fs.accessSync(geekplusExpandResourceUrl, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(geekplusExpandResourceUrl);
  }

  // 检查 .geekplusExpand/cache, 不存在则创建, 存在则清空文件夹
  try {
    fs.accessSync(geekplusExpandCacheUrl, fs.constants.W_OK);
    fs.rmdirSync(geekplusExpandCacheUrl, { recursive: true });
  } catch (error) {}
  fs.mkdirSync(geekplusExpandCacheUrl);

  // 检查是否存在 .gitignore 文件, 如果存在则将 .geekplusExpand 加入忽略项
  try {
    fs.accessSync(geekplusExpandGitignoreUrl, fs.constants.W_OK);
    const gitignoreContent = fs.readFileSync(geekplusExpandGitignoreUrl, 'utf-8');
    if (!gitignoreContent.includes(".geekplusExpand")) {
      fs.appendFileSync(geekplusExpandGitignoreUrl, "\r\n.geekplusExpand");
    }
  } catch (error) {}
}