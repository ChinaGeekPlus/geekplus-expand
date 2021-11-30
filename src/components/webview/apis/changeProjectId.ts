import store from "../../../constants/store";
import * as fs from 'fs';
import * as path from 'path';

export default {
  handler(data, resolve) {
    const { fsPath, geekExpandConfig } = store.getState(['fsPath', 'geekExpandConfig']);
    geekExpandConfig.projectId = data;
    const saveData = JSON.stringify(geekExpandConfig);
    fs.writeFileSync(path.join(fsPath, "/.geekplusExpand/", "config.json"), saveData);
    resolve(true);
  },
};