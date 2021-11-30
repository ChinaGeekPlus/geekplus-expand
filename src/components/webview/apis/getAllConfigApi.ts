/**
 * 获取所有配置项数据
 */
import store from "../../../constants/store";

export default {
  handler(data, resolve) {
    const sendData = store.getState(["gitConfig", "isSyncEslinter", "geekExpandConfig", "i18nData"]);
    resolve(sendData);
  },
};