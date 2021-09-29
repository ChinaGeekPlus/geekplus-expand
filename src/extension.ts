// 加载依赖配置
import * as fs from "fs";
import * as path from "path";
import { workspace, window, Uri, ExtensionContext } from "vscode";

// store
import store from "./constants/store";
import commandLoad from "./constants/subscriptions";

// 检查国际化内容
import { didChangeTextDocument } from "./constants/translation";
import { updateConfigure } from "./constants/configuration";
import { loadResource } from "./constants/resource";
import { initTree } from "./components/treeView";


// 是否初始化正常
let isInit: boolean = true;

const { workspaceFolders } = workspace;
workspaceFolders.length &&
  store.setState("fsPath", workspaceFolders[0].uri.fsPath);

// // 1. 刷新配置项
updateConfigure();

// // 2. 加载所需用数据
loadResource()
  .then(() => {
    // 3. 加载资源树
    initTree();
    // i18n 绑定重绘事件
    workspace.onDidChangeTextDocument(didChangeTextDocument);
    window.onDidChangeActiveTextEditor(didChangeTextDocument);
  })
  .catch((error) => {
    isInit = false;
    window.showErrorMessage(`【GEEK ERROR】 ${error.message}`, "知道了");
  });

// 被激活时触发
export function activate(context: ExtensionContext) {
  store.setState("context", context);

  if (!store.getState("initialization")) {
    commandLoad(context);
    
    const webviewPaht = path.join(__dirname, './view/index.html');
    const data = getWebViewContent(context, webviewPaht);
    store.setState("initialization", true);
    store.setState("webviewContent", data);
  }

  // 进入页面时进行一次重绘
  didChangeTextDocument();
}

export function deactivate() {}


/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
export function getWebViewContent(context, resourcePath) {
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
	// vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});
	return html;
}
