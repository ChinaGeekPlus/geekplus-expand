import { window, workspace, commands, Disposable } from "vscode";
import store from "../store";
import { didChangeTextDocument } from "../translation";
// 注册事件
import * as openWebView from "./commands/openWebView";

export default function commandLoad(context) {
  // 注册 i18n 事件
  store.$on("change:i18nResources", didChangeTextDocument);
  workspace.onDidChangeTextDocument(didChangeTextDocument);
  window.onDidChangeActiveTextEditor(didChangeTextDocument);

  // 注册点击事件
  const disposables: Disposable[] = [];
  [openWebView].forEach(
    (commandItem) => {
      try {
        const commandRus = commands.registerCommand(
          commandItem.commandName,
          commandItem.commandHander
        );
        disposables.push(commandRus);
      } catch (error) {
        window.showErrorMessage(`【GEEK ERROR】 ${error.message}`, "知道了");
      }
    }
  );

  context.subscriptions.push(...disposables);
}
