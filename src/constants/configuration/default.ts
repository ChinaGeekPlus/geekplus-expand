import { Configuration } from "../interface";

/**
 * 配置项默认值
 */
const option: Configuration = {
    i18nMatchRegexp: "$L(${language}),t(${language})",
    i18nMatchResources: "${workspaceFolder}/geekplus-expand.config.js",
};

export default option;