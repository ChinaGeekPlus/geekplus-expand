const state = {
    context: null,  // vscode context数据, 初始化后自动赋值
    fsPath: "",     // vscode 提供的IDE所属文件夹路径, 初始化后赋值

    i18nMatchRegexp: "",    // 关于i18n配置
    i18nMatchResources: "", // 关于i18n配置

    i18nResources: {},  // i18n可用数据源

};

export default state;