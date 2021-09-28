import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { getGitignores, ergodicFiles, checkFileContent } from "./check";

/**
 * 获取某个扩展文件相对于webview需要的一种特殊路径格式
 * 形如：vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
export function getExtensionFileVscodeResource(context, relativePath) {
	const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath));
	return diskPath.with({ scheme: 'vscode-resource' }).toString();
}

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
export function getWebViewContent(context, templatePath) {
	const resourcePath = path.join(context.extensionPath, templatePath);
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
	// vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});
	return html;
}

export function initCheckView(context) {
  vscode.window.showInformationMessage('正在启动对整站项目国际化的检查 ~ 请稍等片刻');
  
  // 创建webview
  const panel = vscode.window.createWebviewPanel(
    "geek_language_view", // viewType
    "代码检索", // 视图标题
    vscode.ViewColumn.One, // 显示在编辑器的哪个部位
    {
      enableScripts: true, // 启用JS，默认禁用
      retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
    }
  );
  panel.webview.html = getWebViewContent(context, 'src/view/index.html');

  // webview 初始化完成
  panel.webview.onDidReceiveMessage(message => {
    if (message.ok) {
      start(context, panel);
    }

    // if (message.type === 1) {
    //   goTo(message.toData);
    // }
  }, undefined, context.subscriptions);
}

function start(context, panel) {
  panel.webview.postMessage({ type: "option", message: "查询项目忽略项 [.gitignore]", data: { id: "gitignore", is: false } });
  
  getGitignores().then((list) => {
    panel.webview.postMessage({ type: "option", message: "查询项目忽略项 [.gitignore]", data: { id: "gitignore", is: true } });
    panel.webview.postMessage({ type: "gitignoreList", message: "", data: list });
    panel.webview.postMessage({ type: "info", message: "开始检索" });
  
    return ergodicFiles(panel);
  }).then((matches: Array<String>) => {
    panel.webview.postMessage({ type: "info", message: `共找到${matches.length}个文件, 开始匹配` });
    matches.forEach((item: String) => {
      const dirname = vscode.workspace.workspaceFolders[0] || { uri: { fsPath: "" } };
      const cwd = path.resolve(path.join(dirname.uri.fsPath, item as string));
      const checkViewData = checkFileContent(cwd);
      panel.webview.postMessage({ type: "checkView", message: "", data: checkViewData });
    });
  });
}

// function goTo(viewPage) {
  // vscode.commands.executeCommand("vscode.openWith", vscode.Uri.file(viewPage.fileUrl));
// }