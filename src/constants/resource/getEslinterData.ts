/* 在这里获取git相关信息 */
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import store from "../store";
import eslintConfText from './eslintrcConf/ark100_eslintrc';

export function loadResource(context: vscode.ExtensionContext) {
  const fsPath = store.getState("fsPath");

  return new Promise((resolve, reject) => {
    try {
      // 仅查看是否完全一致
      const curEslintData = fs.readFileSync(path.join(fsPath, ".eslintrc.js"));
      const isSync = eslintConfText === curEslintData.toString();
      resolve({ eslintConfText, isSync });
    } catch (error) {
      resolve({ eslintConfText: '', isSync: false });
    }
  });
}
