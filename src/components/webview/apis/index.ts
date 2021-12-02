import axios from 'axios';
import getAllConfigApi from "./getAllConfigApi";
import syncEslintrc from "./syncEslintrc";
import changeProjectId from "./changeProjectId";
import updateVscodeState from "./updateVscodeState";
import updateI18nData from "./updateI18nData";
import updateProjectI18nData from "./updateProjectI18nData";

// 挂载API
const Apis = { getAllConfigApi, syncEslintrc, changeProjectId, updateVscodeState, updateI18nData, updateProjectI18nData };

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