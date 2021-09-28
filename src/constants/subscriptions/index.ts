import * as vscode from "vscode";
import { refreshTree } from "../tree";
import copyText from "../tool/copy";
import { initCheckView } from "../checkView/index";

export default function subscriptions(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("activitybar.refreshEntry", () => {
      refreshTree();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("activitybar.copyEntry", (dataItem) => {
      copyText(dataItem.label);
    })
  );
  // bugfix
  context.subscriptions.push(
    vscode.commands.registerCommand("activitybar.debug", (dataItem) => {
		initCheckView(context);
    })
  );
}
