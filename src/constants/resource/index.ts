import { ExtensionContext } from "vscode";

import store from "../store";
import * as loadConfJS from "./loadConfJS";
import * as loadWebView from "./loadWebView";

import { GeekplusExpandConfig } from "../interface";

/**
 * 获取路径资源 JSON
 * @param filePath 本地路径
 */
export function loadResource(context: ExtensionContext) {
  return new Promise((resolve, reject) => {
    Promise.all([
      loadConfJS.loadResource(context),
      loadWebView.loadResource(context),
    ]).then(([geekplusConfig, webviewContent]) => {
      store.setStateMap({ geekplusConfig, webviewContent });
      parseGeekExpand(geekplusConfig as GeekplusExpandConfig);
      resolve(true);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export function parseGeekExpand(config: GeekplusExpandConfig) {
  (config.i18nMatchResources as Function)((i18nResources: Object = {}) => {
    const i18nMatchRegexp = parseI18nMatchRegexp(config.i18nMatchRegexp);
    store.setStateMap({ i18nMatchRegexp, i18nResources });
  });
}

// 生产正则匹配的规则
export function parseI18nMatchRegexp(i18nMatchRegexp: string[]) {
  const funcFlagList = i18nMatchRegexp.map(funcFlagItem => {
    return [...funcFlagItem].map(str => ['$','.', '"', "'"].includes(str) ? `\\${str}` : str).join("");
  });
  return `(?:${funcFlagList.join("|")}) {0,}\\( {0,}['"]([^'"]+)['"] {0,}\\)`;
}