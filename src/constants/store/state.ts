const state = {
    context: null,  // vscode context数据, 初始化后自动赋值
    fsPath: "",     // vscode 提供的IDE所属文件夹路径, 初始化后赋值
    initialization: false,  // 当第一次初始化完成后变成true
    webviewContent: "", // webview数据

    // 资源数据
    gitConfig: {}, // git数据
    eslintConfText: "", // eslint数据内容
    isSyncEslinter: false,  // eslint是否一致
    i18nData: {},  // i18n数据
    i18nMatchRegexp: '', // i18n正则匹配规则
    geekExpandConfig: {}, // Geek配置项内容
};

export default state;
