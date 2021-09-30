export interface GeekplusExpandConfig {
    // i18n的匹配校验正则
    i18nMatchRegexp: string[],
    // i18n已存在的匹配项文件
    i18nMatchResources: string | Function,
    // i18n检查忽略文件, glob文件匹配模式, 没有设置该项, 将默认读取根目录下.gitignore文件作为匹配忽略依据
    i8nIgnore?: string[],
}
