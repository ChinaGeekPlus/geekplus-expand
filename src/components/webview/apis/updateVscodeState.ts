import store from "../../../constants/store";
import { loadResource } from '../../../constants/resource';

export default {
  handler(data, resolve) {
    const context = store.getState("context");
    loadResource(context, data).then(() => {
      debugger;
      const sendData = store.getState(["gitConfig", "isSyncEslinter", "geekExpandConfig", "i18nData"]);
      resolve(sendData);
    }).catch(error => {
      debugger;
    });
  },
};