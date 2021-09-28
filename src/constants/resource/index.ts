import store from "../store";
import * as loadI18n from "./loadI18n";

/**
 * 获取路径资源 JSON
 * @param filePath 本地路径
 */
export function loadResource() {
  return new Promise((resolve, reject) => {
    loadI18n.loadResource().then((data) => {
      store.setState("i18nResources", data);
      resolve(true);
    }).catch((error) => {
      reject(error);
    });
  });
}