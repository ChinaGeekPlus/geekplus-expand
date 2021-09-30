/**
 * 根据vue的生命周期模拟出的生命周期(简化)
 */
import { workspace, window, ExtensionContext } from "vscode";

import { didChangeTextDocument } from "./constants/translation";
import { loadResource } from "./constants/resource";
import { initTree } from "./components/treeView";

import commandLoad from "./constants/subscriptions";
import store from "./constants/store";

export default {
  // 插件初始化, 永远只会执行一次
  async created(context: ExtensionContext) {
    // 获取当前项目路径
    const { workspaceFolders } = workspace;
    if (workspaceFolders.length) {
      store.setState("fsPath", workspaceFolders[0].uri.fsPath);
    } else {
      window.showErrorMessage(`【GEEK ERROR】 因为一个未知的原因, 没有找到当前项目的路径, geekplus-expand可能无法正常工作`, "知道了");
    }

    // 加载资源文件
    try {
      await loadResource(context);
    } catch (error) {
      window.showErrorMessage(`【GEEK ERROR】 资源加载失败, ${error.message}`, "知道了");
    }

    // 绑定一些事件
    commandLoad(context);

    // 最后 加载资源树
    initTree();
  },

  activate(context: ExtensionContext) {},
  // 销毁
  deactivate() {}
};