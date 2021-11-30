/* 在这里获取git相关信息 */
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import store from "../store";

export function loadResource(context: vscode.ExtensionContext) {
  const fsPath = store.getState("fsPath");

  return new Promise((resolve, reject) => {
    try {
      const geekExpandConf = fs.readFileSync(path.join(fsPath, "/.geekplusExpand/", "config.json"));
      resolve(JSON.parse(geekExpandConf.toString()));
    } catch (error) {
      resolve({});
    }
  });
}
