import { ExtensionContext } from "vscode";

export interface StoreState {
    context: ExtensionContext,  // vscode context数据, 初始化后自动赋值
    fsPath: string,     // vscode 提供的IDE所属文件夹路径, 初始化后赋值
    initialization: boolean,  // 当第一次初始化完成后变成true
    i18nResources: Object,  // i18n可用数据源
    i18nMatchRegexp: string, // i18n可用正则

    webviewContent: string, // webview数据
    geekplusConfig: Object, // geekplus-expand.config数据集合
}
