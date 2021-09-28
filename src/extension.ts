// 加载依赖配置
import { workspace, window, languages } from 'vscode';

// 树结构
import { initTree } from "./constants/tree";
// 加载国际化文件数据
import { loadResource } from "./constants/resource/requestTranslate";
// 检查国际化内容
import { didChangeTextDocument } from "./constants/translation";
// 配置项
import { getResetConfigure } from './config/configure';
// 加载事件
import subscriptions from "./constants/subscriptions";

// =============== init ==============
// 加载用户配置
const configure = getResetConfigure();

// 如果配置项不存在, 直接警告
if (!configure.resources) {
	window.showInformationMessage('geek-plus-language 配置resources为空, 因此没有可用的资源!');
} else {
	// 加载资源
	loadResource();
	
	// 加载树
	initTree();
	
	// 绑定重绘事件
	workspace.onDidChangeTextDocument(didChangeTextDocument);
	window.onDidChangeActiveTextEditor(didChangeTextDocument);
}


export function activate(context: { subscriptions: any[]; }) {
	// 进入页面时进行一次重绘
	didChangeTextDocument();
	
	subscriptions(context);
}

export function deactivate() {}
