import * as vscode from "vscode";
import { refreshTree } from "../../components/treeView";
import copyText from "../tool/copy";
import { initCheckView } from "../../components/webview/index";

export default function subscriptions(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("geekplus_command.refreshEntry", () => {
      refreshTree();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "geekplus_command.copyEntry",
      (dataItem) => {
        copyText(dataItem.label);
      }
    )
  );
  // bugfix
  context.subscriptions.push(
    vscode.commands.registerCommand("geekplus_command.debug", (dataItem) => {
      initCheckView(context);
    })
  );
}
