import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import store from "../store";

/**
 * 获取路径资源 JSON
 * @param filePath 本地路径
 */
export function loadResource() {
  const { fsPath, i18nMatchResources } = store.getState([
    "fsPath",
    "i18nMatchResources",
  ]);

  // 路径资源地址, 支持使用 ${workspaceFolder} 来表示本项目根路径
  const resources = i18nMatchResources.replace("${workspaceFolder}", fsPath);

  // 2种加载, js文件 或者 json文件
  return new Promise((resolve, reject) => {
    // 如果是js, 则用 require 载入的方式
    if (resources.endsWith(".js")) {
      try {
        const resourcesFs = require(resources);
        resourcesFs(vscode).then((data) => {
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    } else {
      fs.readFile(path.resolve(resources), (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    }
  });
}
