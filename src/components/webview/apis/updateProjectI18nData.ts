import axios from 'axios';
import store from "../../../constants/store";
import * as fs from 'fs';
import * as path from 'path';

function requestI18nCommon(ip, id) {
  return axios.get(`http://${ip}/${id}/api/coreresource/i18n/getLangItems/v1?languageCode=zh_cn`);
}

export default {
  handler({ type }, resolve) {
    const { fsPath } = store.getState(['fsPath']);
    let ip = '';

    switch (type) {
      case 'ssc':
        ip = require(path.join(fsPath, "ssc.vue.config.js")).devServerIp;
        requestI18nCommon(ip, type).then((data) => {
          fs.writeFileSync(path.join(fsPath, "/.geekplusExpand/resource/", "i18n.json"), JSON.stringify(data));
          resolve(true);
        });
        break;
      case 'gles':
        ip = require(path.join(fsPath, "gles.vue.config.js")).devServerIp;
        requestI18nCommon(ip, type).then((data) => {
          fs.writeFileSync(path.join(fsPath, "/.geekplusExpand/resource/", "i18n.json"), JSON.stringify(data));
          resolve(true);
        });
        break;
    }
  },
};