/**
 * 所有的资源都在这里进行统一调度
 * loadResource 函数中加载所有的资源获取, 然后在then中处理数据
 * 
 * 需要加载的资源在 resource.config.ts中进行配置
 */

import { ExtensionContext } from "vscode";
import resourceConfig from "./resource.config";

/**
 * 这里仅获取webview中所需要的数据
 * 获取路径资源 JSON
 * @param filePath 本地路径
 */
export function loadResource(context: ExtensionContext, type = 'ready') {
  
  return new Promise((resolve, reject) => {
    Promise.all([
      ...resourceConfig[type].map(item => item.that.loadResource(context)),
    ]).then((handlerDataList) => {
      resourceConfig[type].forEach((item, index) => {
        item.handler(handlerDataList[index]);
      });
      resolve(true);
    })
    .catch((error) => {
      reject(error);
    });
  });
}
