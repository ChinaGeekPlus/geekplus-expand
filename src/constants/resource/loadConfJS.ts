import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import store from "../store";
import geekplusExpandConfig from "./geekplusExpandConfig";
/**
 * 获取路径资源 JSON
 * @param filePath 本地路径
 */
export function loadResource(context: vscode.ExtensionContext) {
  const fsPath = store.getState("fsPath");
  const modularPath = path.join(fsPath, "geekplus-expand.config.js");

  return new Promise((resolve) => {
    fs.access(modularPath, fs.constants.F_OK, (error) => {
      // 如果本地没有存在 geekplus-expand.config.js, 则使用默认配置
      if (error) {
        resolve(geekplusExpandConfig);
      } else {
        resolve(require(modularPath));
      }
    });
  });
}
