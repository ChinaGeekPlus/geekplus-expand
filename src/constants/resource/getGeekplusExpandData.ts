/* 在这里获取git相关信息 */
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import store from "../store";

export function loadResource(context: vscode.ExtensionContext) {
  const geekplusExpandPath = store.getState("geekplusExpandPath");

  return new Promise((resolve, reject) => {
    try {
      const geekExpandConf = fs.readFileSync(path.join(geekplusExpandPath, "config.json"));
      resolve(JSON.parse(geekExpandConf.toString()));
    } catch (error) {
      resolve({});
    }
  });
}
