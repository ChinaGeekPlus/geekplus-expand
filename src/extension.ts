
import { ExtensionContext, commands } from "vscode";
import extensionConf from "./index";
// store
import store from "./constants/store";

let isInit: boolean = false;

// 被激活时触发
export function activate(context: ExtensionContext) {
  store.setState("context", context);

  if (!isInit) {
    isInit = true;
    extensionConf.created(context).then(() => {
      store.setState("initialization", true);
      extensionConf.activate(context);
      commands.executeCommand('setContext', 'geekplus_command.readyView', true);
    });
  }
  
}

export function deactivate() {
  extensionConf.deactivate();
}
