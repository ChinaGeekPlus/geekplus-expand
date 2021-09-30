
import { ExtensionContext } from "vscode";
import extensionConf from "./index";
// store
import store from "./constants/store";

let isInit: boolean = false;

// 被激活时触发
export function activate(context: ExtensionContext) {
  if (!isInit) {
    isInit = true;
    extensionConf.created(context);
    store.setState("initialization", true);
  }

  store.setState("context", context);
  extensionConf.activate(context);
}

export function deactivate() {
  extensionConf.deactivate();
}
