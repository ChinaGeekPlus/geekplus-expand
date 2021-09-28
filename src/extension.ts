// 加载依赖配置
import { workspace, window } from 'vscode';
import store from "./constants/store";

// 检查国际化内容
import { didChangeTextDocument } from "./constants/translation";
import { updateConfigure } from "./constants/configuration";
import subscriptions from "./constants/subscriptions";
import { loadResource } from "./constants/resource";
import { initTree } from "./components/treeView";

// 是否初始化正常
let isInit:boolean = true;

const { workspaceFolders } = workspace;
workspaceFolders.length && store.setState("fsPath", workspaceFolders[0].uri.fsPath);

// 1. 刷新配置项
updateConfigure();

// 2. 加载所需用数据
loadResource().then(() => {
	// 3. 加载资源树
	initTree();

	// i18n 绑定重绘事件
	workspace.onDidChangeTextDocument(didChangeTextDocument);
	window.onDidChangeActiveTextEditor(didChangeTextDocument);
}).catch((error) => {
	isInit = false;
	window.showErrorMessage(`【GEEK ERROR】 ${error.message}`, "知道了");
});

// 被激活时触发
export function activate(context: { subscriptions: any[]; }) {
	store.setState("context", context);

	// 进入页面时进行一次重绘
	didChangeTextDocument();
	
	subscriptions(context);
}

export function deactivate() {}
