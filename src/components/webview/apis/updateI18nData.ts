import store from "../../../constants/store";
import * as fs from 'fs';
import * as path from 'path';

export default {
  handler(data, resolve) {
    // 将标准的eslint文本写入项目
    const { fsPath } = store.getState(['fsPath']);
    fs.writeFileSync(path.join(fsPath, "/.geekplusExpand/resource/", "i18n.json"), JSON.stringify(data));
    resolve(true);
  },
};