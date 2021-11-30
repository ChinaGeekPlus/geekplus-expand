/* 在这里获取i18n相关信息 */
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import store from "../store";

export function loadResource(context: vscode.ExtensionContext) {
  const fsPath = store.getState("fsPath");

  return new Promise((resolve, reject) => {
    try {
      const i18nConfig = fs.readFileSync(path.join(fsPath, "/.geekplusExpand/resource", "i18n.json"));
      resolve(JSON.parse(i18nConfig.toString()));
    } catch (error) {
      resolve({});
    }
  });
}
