/**
 * 根据vue的生命周期模拟出的生命周期(简化)
 */
import { workspace, window, ExtensionContext } from "vscode";
import geekExpandConfigHandle from './constants/geekConfigHandle';
import transferConfigSync from './constants/resource/defaultValue/geekplusExpandTransfer'
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
      // 新增geekplusExpandPath目录信息
      store.setState("geekplusExpandPath", path.join(fsPath, '/.vscode', "/geekplusExpand"));
    } else {
      window.showErrorMessage(`因为一个未知的原因, 没有找到当前项目的路径, geekplus-expand可能无法正常工作`, "知道了");
      return false;
    }

    /**
     * 历史遗留校验: 检查目录下是否存在 .geekplusExpand, 如果存在则移动至.vscode
     * 这个校验将在2.0版本被删除
     */
    try {
      fs.accessSync(path.join(fsPath, ".geekplusExpand"), fs.constants.W_OK);
      transferConfigSync(fsPath);
    } catch (error) {}

    try {
      fs.accessSync(path.join(fsPath, "/.vscode/geekplusExpand"), fs.constants.W_OK);
    } catch (error) {
      window.showErrorMessage(`资源加载失败 01, ${error.message}`, "知道了");
      return false;
    }

    // 加载资源文件 TODO: 加载资源文件分为初始资源和webview资源, 这里仅加载初始资源
    try {
      await loadResource(context, "ready");
      
      // 处理geekExpandConfig
      geekExpandConfigHandle();
    } catch (error) {
      window.showErrorMessage(`资源加载失败, ${error.message}`, "知道了");
      return false;
    }
  },

  activate(context: ExtensionContext) {},

  // 销毁
  deactivate() {}
};