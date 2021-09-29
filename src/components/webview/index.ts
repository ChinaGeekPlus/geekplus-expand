import { Uri, window, workspace, ViewColumn, ExtensionContext, WebviewPanel, commands } from "vscode";
import store from "../../constants/store";
import * as path from "path";

import { getGitignores, ergodicFiles, checkFileContent } from "./check";

/**
 * 获取某个扩展文件相对于webview需要的一种特殊路径格式
 * 形如：vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
export function getExtensionFileVscodeResource(context: ExtensionContext, relativePath: string) {
	const diskPath = Uri.file(path.join(context.extensionPath, relativePath));
	return diskPath.with({ scheme: 'vscode-resource' }).toString();
}

export function initCheckView() {
  window.showInformationMessage('正在启动对整站项目国际化的检查 ~ 请稍等片刻');
  const { webviewContent, context }: { webviewContent: string, context: ExtensionContext } = store.getState(["webviewContent", "context"]);
  
  // 创建webview
  const panel = window.createWebviewPanel(
    "geekplusLanguageView", // viewType
    "check i18n", // 视图标题
    ViewColumn.One, // 显示在编辑器的哪个部位
    {
      enableScripts: true, // 启用JS，默认禁用
      retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
    }
  );

  panel.webview.html = webviewContent;

  // webview 初始化完成
  panel.webview.onDidReceiveMessage(message => {
    if (message.ok) {
      start(context, panel);
    }

    if (message.type === 1) {
      goTo(message.toData);
    }
  }, undefined, context.subscriptions);
}

function start(context: ExtensionContext, panel: WebviewPanel) {
  panel.webview.postMessage({ type: "option", message: "查询项目忽略项 [.gitignore]", data: { id: "gitignore", is: false } });
  
  getGitignores().then((list) => {
    panel.webview.postMessage({ type: "option", message: "查询项目忽略项 [.gitignore]", data: { id: "gitignore", is: true } });
    panel.webview.postMessage({ type: "gitignoreList", message: "", data: list });
    panel.webview.postMessage({ type: "info", message: "开始检索" });
  
    return ergodicFiles(panel);
  })
  .then((matches: Array<String>) => {
    panel.webview.postMessage({ type: "info", message: `共找到${matches.length}个文件, 开始匹配` });
    matches.forEach((item: String) => {
      const dirname = workspace.workspaceFolders[0] || { uri: { fsPath: "" } };
      const cwd = path.resolve(path.join(dirname.uri.fsPath, item as string));
      const checkViewData = checkFileContent(cwd);
      panel.webview.postMessage({ type: "checkView", message: "", data: checkViewData });
    });
  });
}

function goTo(viewPage) {
  commands.executeCommand("vscode.openWith", Uri.file(viewPage.fileUrl));
}