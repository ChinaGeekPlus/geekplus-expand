import { window, workspace, commands, Disposable } from "vscode";
import store from "../store";
import { didChangeTextDocument } from "../translation";
// 注册事件
import * as command_refreshEntry from "./commands/refreshEntry";
import * as command_checkView from "./commands/checkView";
import * as command_copyEntry from "./commands/copyEntry";

export default function commandLoad(context) {
  // 注册 i18n 事件
  store.$on("change:i18nResources", didChangeTextDocument);
  workspace.onDidChangeTextDocument(didChangeTextDocument);
  window.onDidChangeActiveTextEditor(didChangeTextDocument);

  // 注册点击事件
  const disposables: Disposable[] = [];
  [command_refreshEntry, command_copyEntry, command_checkView].forEach(
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
