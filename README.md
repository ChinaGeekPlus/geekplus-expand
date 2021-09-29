# geek-plus-expand README

geekplus visual studio code扩展(前端)
目前仅支持对国际化的简单处理操作

### 参数:
#### geekplus.i18nMatchResources 
> i18n对照文件, 可以传入一个JSON或一个js文件, 支持使用`${workspaceFolder}`表示当前项目文件夹
- 默认 `${workspaceFolder}/geekplus-expand.config.js`

#### geekplus.i18nMatchRegexp
> i18n校验表达式, 多个表达式用`,`隔开
- 默认 `$L(${language}),t(${language})`
