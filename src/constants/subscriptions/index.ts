import { window, workspace, commands, Disposable, ExtensionContext } from "vscode";
import store from "../store";
import { didChangeTextDocument } from "../translation";
// 注册事件
// import * as openWebView from "./commands/openWebView";

export default function commandLoad(context: ExtensionContext) {
  // 注册点击事件
  // [openWebView].forEach(
  //   (commandItem) => {
  //     try {
  //       const commandRus = commands.registerCommand(
  //         commandItem.commandName,
  //         commandItem.commandHander
  //       );
  //       context.subscriptions.push(commandRus);
  //     } catch (error) {
  //       window.showErrorMessage(`【GEEK ERROR】 ${error.message}`, "知道了");
  //     }
  //   }
  // );

  // 注册 i18n 事件
  store.$on("change:i18nResources", didChangeTextDocument);
  workspace.onDidChangeTextDocument(didChangeTextDocument);
  window.onDidChangeActiveTextEditor(didChangeTextDocument);
}
