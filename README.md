# geek-plus-expand README

geekplus visual studio code扩展(前端)  
目前仅支持对国际化的简单处理操作  
参数需要使用项目根路径下 `geekplus-expand.config.js` 文件输出  

### 输出参数:
参数名 | 参数类型 | 说明
------|---------|--------
`i18nMatchResources` | `function(callback)` | i18n对照数据, 数据传入回调函数的 `callback`
`i18nMatchRegexp`   | `string[]`  | i18n函数名, 默认 `['$L', 't']`
`i8nIgnore`         | `string[]`  | i18n检查忽略文件, 使用glob文件匹配模式, 默认读取根目录下`.gitignore`文件作为匹配忽略依据
