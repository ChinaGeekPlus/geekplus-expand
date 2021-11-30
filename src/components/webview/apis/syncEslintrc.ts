import store from "../../../constants/store";
import * as fs from 'fs';
import * as path from 'path';

export default {
  handler(data, resolve) {
    // 将标准的eslint文本写入项目
    const { fsPath, eslintConfText } = store.getState(['fsPath', 'eslintConfText']);
    fs.writeFileSync(path.join(fsPath, ".eslintrc.js"), eslintConfText);
    resolve(true);
  },
};