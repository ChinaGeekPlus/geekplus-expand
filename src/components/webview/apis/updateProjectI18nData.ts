import axios from 'axios';
import store from "../../../constants/store";
import * as fs from 'fs';
import * as path from 'path';

// 请求I18N接口数据
function requestI18nCommon(ip: string, id: string) {
  return axios.get(`http://${ip}/${id}/api/coreresource/i18n/getLangItems/v1?languageCode=zh_cn`);
}

// 从自定义服务获取i18n
function getServiceTypeByCustom(reqType: string = 'get', reqUrl: string) {
  return axios[reqType](reqUrl);
}

// 从本地服务器获取i18n
function getServiceTypeByAuto(type: string, resolve: Function) {
  const { fsPath, geekplusExpandPath } = store.getState(['fsPath', 'geekplusExpandPath']);
  let ip = '', httpUrl = '';

  switch (type) {
    case 'ssc':
      ip = require(path.join(fsPath, "ssc.vue.config.js")).devServerIp;
      requestI18nCommon(ip, type).then((data) => {
        fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
        resolve(data);
      }).catch(() => resolve(null));
      break;
    case 'gles':
      ip = require(path.join(fsPath, "gles.vue.config.js")).devServerIp;
      requestI18nCommon(ip, 'gles-server').then((data) => {
        fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
        resolve(data);
      }).catch(() => resolve(null));
      break;
    case 'avalon':
      ip = require(path.join(fsPath, "avalon.vue.config.js"))?.devServerIp;
      requestI18nCommon(ip, 'avalon-web').then((data) => {
        fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
        resolve(data);
      }).catch(() => resolve(null));
      break;
    case 'ark':
      ip = require(path.join(fsPath, "/config/index.js"))?.dev?.serverIP;
      requestI18nCommon(ip, 'ark-web').then((data) => {
        fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
        resolve(data);
      }).catch(() => resolve(null));
      break;
    case 'auth':
      httpUrl = require(path.join(fsPath, "vue.config.js"))?.devServer?.proxy['/auth-manage'].target;
      ip = /https?:\/\/(.+)\//.exec(httpUrl)[1];
      requestI18nCommon(ip, 'auth-manage').then((data) => {
        fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
        resolve(data);
      }).catch(() => resolve(null));
      break;
    case 'rms':
      httpUrl = require(path.join(fsPath, "/config/envConfig/app.dev.conf.js"))?.API_URL;
      ip = /https?:\/\/(.+)\//.exec(httpUrl)[1];
      requestI18nCommon(ip, type).then((data) => {
        fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
        resolve(data);
      }).catch(() => resolve(null));
      break;
    default:
      break;
  }
}

export default {
  handler({ type }, resolve: Function) {
    const { geekExpandConfig, geekplusExpandPath } = store.getState(['geekplusExpandPath', 'geekExpandConfig']);
    const { serviceType = 'auto', projectId, requestType, requestUrl } = geekExpandConfig;
    const curType = type || projectId;
    if (curType) {
      if (serviceType === 'auto') {
        getServiceTypeByAuto(curType, resolve);
      } else if (requestUrl) {
        getServiceTypeByCustom(requestType, requestUrl).then((data) => {
          fs.writeFileSync(path.join(geekplusExpandPath, "/resource/", "i18n.json"), JSON.stringify(data));
          resolve(data);
        })
        .catch(() => {
          resolve(null);
        });
      }
    } else {
      resolve(null);
    }
  },
};