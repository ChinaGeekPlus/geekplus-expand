/**
 * ⭐ 该文件是用户的配置文件
 */

import * as vscode from 'vscode';

// 默认的配置文件内容
const configure = {
  // 正则匹配
  regexp: "",
  // 资源, JSON 或 .js 文件, js 文件应暴露一个
  resources: "",
};

// 初始化配置
export function initConfigure() {
  // TODO:
}

// 获取并刷新配置文件
export function getResetConfigure() {
	const { workspace } = vscode;
	const config = workspace.getConfiguration('geekLanguage');
  const { regexp, resources } = config;
  configure.regexp = regexp;
  configure.resources = resources;
  return configure;
}
