/**
 * 根据vue的生命周期模拟出的生命周期(简化)
 */
import { workspace, window, ExtensionContext } from "vscode";

import { loadResource } from "./constants/resource";
import commandLoad from "./constants/subscriptions";
import store from "./constants/store";
import * as path from "path";
import * as fs from "fs";

export default {
  // 插件初始化, 永远只会执行一次
  async created(context: ExtensionContext) {
    // 绑定一些事件
    commandLoad(context);

    // 获取当前项目路径
    const { workspaceFolders } = workspace;
    let fsPath = "";
    if (workspaceFolders.length) {
      fsPath = workspaceFolders[0].uri.fsPath;
      store.setState("fsPath", fsPath);
    } else {
      window.showErrorMessage(`【GEEK ERROR】 因为一个未知的原因, 没有找到当前项目的路径, geekplus-expand可能无法正常工作`, "知道了");
      return false;
    }

    /**
     * 检查目录下是否存在 .geekplusExpand 
     * 如果不存在geekplusExpand 取消此功能
     */
    try {
      fs.accessSync(path.join(fsPath, ".geekplusExpand"), fs.constants.W_OK);
    } catch (error) {
      return false;
    }

    // 加载资源文件 TODO: 加载资源文件分为初始资源和webview资源, 这里仅加载初始资源
    try {
      await loadResource(context, "ready");
    } catch (error) {
      window.showErrorMessage(`【GEEK ERROR】 资源加载失败, ${error.message}`, "知道了");
      return false;
    }
  },

  activate(context: ExtensionContext) {},

  // 销毁
  deactivate() {}
};