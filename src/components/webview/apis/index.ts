import axios from 'axios';
import getAllConfigApi from "./getAllConfigApi";
import syncEslintrc from "./syncEslintrc";
import updateVscodeState from "./updateVscodeState";
import updateI18nData from "./updateI18nData";
import updateProjectI18nData from "./updateProjectI18nData";

// geekExpandConfig 相关API
import changeProjectId from "./geekExpandConfig/changeProjectId";
import setAutoPattern from "./geekExpandConfig/setAutoPattern";
import setMatchI18nRegexp from "./geekExpandConfig/setMatchI18nRegexp";
import setMatchI18nType from "./geekExpandConfig/setMatchI18nType";
import setRequestType from "./geekExpandConfig/setRequestType";
import setRequestUrl from "./geekExpandConfig/setRequestUrl";
import setServiceType from "./geekExpandConfig/setServiceType";

// 挂载API
const Apis = {
  getAllConfigApi, syncEslintrc, changeProjectId, updateVscodeState, updateI18nData, updateProjectI18nData,
  setAutoPattern, setMatchI18nRegexp, setMatchI18nType, setRequestType, setRequestUrl, setServiceType
};

// 自动填充cookie
axios.defaults.withCredentials = true;
// 设置超时时间
axios.defaults.timeout = 10000;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  const { code, data, msg } = response.data;
  if (Number(code) !== 0) {
    return Promise.reject(msg);
  } else {
    return data;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

const errorMessage = {
  status: 1,
  message: "API服务器异常",
};

const noApiMessage = {
  status: 1,
  message: "没有可用的通信API",
};

export function initApis(webview, subscriptions) {
  webview.onDidReceiveMessage(message => {
    const { uid, url, data } = message;
    const api = Apis[url];

    if (api) {
      try {
        api.handler(data, function(sendData) {
          webview.postMessage({
            uid,
            status: 0,
            data: sendData,
            message: "success",
          });
        });
      } catch (error) {
        debugger;
        webview.postMessage({ uid, ...errorMessage });
      }
    } else {
      debugger;
      webview.postMessage({ uid, ...noApiMessage });
    }
  }, undefined, subscriptions);  
}

export function executeApi(apiName: string, option: object) {
  return new Promise((resolve, reject) => {
    try {
      Apis[apiName].handler(option, (callbackData: any) => {
        resolve(callbackData);
      });
    } catch (error) {
      reject(error);
    }
  });
}
