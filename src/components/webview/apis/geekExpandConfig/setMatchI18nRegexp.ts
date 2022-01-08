import store from "../../../../constants/store";
import * as fs from 'fs';
import * as path from 'path';

export default {
  handler(data, resolve) {
    const { geekplusExpandPath, geekExpandConfig } = store.getState(['geekplusExpandPath', 'geekExpandConfig']);
    geekExpandConfig.matchI18nRegexp = data;
    const saveData = JSON.stringify(geekExpandConfig);
    fs.writeFileSync(path.join(geekplusExpandPath, "config.json"), saveData);
    resolve(true);
  },
};