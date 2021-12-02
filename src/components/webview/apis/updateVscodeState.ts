import store from "../../../constants/store";
import { loadResource } from '../../../constants/resource';

export default {
  handler(data, resolve) {
    const context = store.getState("context");
    const { type } = data;
    loadResource(context, type).then(() => {
      const sendData = store.getState(["gitConfig", "isSyncEslinter", "geekExpandConfig", "i18nData"]);
      resolve(sendData);
    }).catch(error => {});
  },
};