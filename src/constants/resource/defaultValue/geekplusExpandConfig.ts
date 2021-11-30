import { GeekplusExpandConfig } from "../../interface/index";

const DEFAULT_GEEKPLUS_EXPANDCONFIG: GeekplusExpandConfig["i18n"] = {
  /**
   * 可用的国际化数据
   * @returns { string, Promise }
   */
  i18nMatchResources(next: Function) {
    next({});
  },

  // 国际化函数名或别名
  i18nMatchRegexp: ["$L", "t"],

};

export default DEFAULT_GEEKPLUS_EXPANDCONFIG;
