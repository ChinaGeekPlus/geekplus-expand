/**
 * ⭐ 该文件是用户的配置文件
 */

import * as vscode from "vscode";
import defaultConfig from "./default";
import store from "../store";

// 获取并刷新配置文件
export function updateConfigure() {
  const { workspace } = vscode;

  // 获取用户的配置信息
  const config: vscode.WorkspaceConfiguration = workspace.getConfiguration("geekplus");

  // 更新store
  Object.keys(config).forEach((key: string) => {
    store.setState(key, config[key] || defaultConfig[key]);
  });
}
