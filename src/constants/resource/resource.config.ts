import store from "../store";
import { GeekplusExpandConfig } from "../interface";

// webview
import * as loadWebView from "./loadWebView";

// get
import * as loadGitData from "./getGitData";
import * as loadEslinterData from "./getEslinterData";
import * as loadGeekplusExpandData from "./getGeekplusExpandData";
import * as loadI18nData from "./getI18nData";

const loadWebViewConf = {
  that: loadWebView,
  handler(data) {
    store.setState("webviewContent", data);
  },
};

const loadEslinterDataConf = {
  that: loadEslinterData,
  handler({ eslintConfText, isSync }) {
    store.setStateMap({
      isSyncEslinter: isSync,
      eslintConfText
    });
  },
};

const loadGeekplusExpandDataConf = {
  that: loadGeekplusExpandData,
  handler(geekExpandConfig) {
    const { matchI18nType = '', matchI18nRegexp = '' } = geekExpandConfig;
    // 解析regexp
    let i18nMatchRegexp = matchI18nRegexp;
    if (matchI18nType !== 'regexp') {
      i18nMatchRegexp = parseI18nMatchRegexp(matchI18nRegexp.split(',') || ['t']);
    }
    store.setStateMap({ geekExpandConfig, i18nMatchRegexp });
  },
};

const loadGitDataConf = {
  that: loadGitData,
  handler(data) {
    store.setState("gitConfig", data);
  },
};

const loadI18nDataConf = {
  that: loadI18nData,
  handler(data) {
    store.setState("i18nData", data);
  },
};

export default {
  // 初始化需要加载的数据, 缓存的国际化数据和config
  ready: [loadGeekplusExpandDataConf, loadI18nDataConf],

  // 打开webview前需要加载的数据
  webview: [loadWebViewConf, loadEslinterDataConf, loadGeekplusExpandDataConf, loadGitDataConf],

  // 刷新时需要加载的数据
  update: [loadEslinterDataConf, loadI18nDataConf],

  // 仅更新i18n数据
  i18nData: [loadI18nDataConf]
};


// 生产正则匹配的规则
export function parseI18nMatchRegexp(i18nMatchRegexp: string[]) {
  const funcFlagList = i18nMatchRegexp.map((funcFlagItem: string) => {
    return [...(funcFlagItem as any)].map(str => ['$','.', '"', "'"].includes(str) ? `\\${str}` : str).join("");
  });
  return `(?:${funcFlagList.join("|")}) {0,}\\( {0,}['"]([^'"]+)['"] {0,}\\)`;
}
