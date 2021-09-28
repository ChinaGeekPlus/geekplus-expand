# geek-plus-language README

用于vue或js文件, 能够实时翻译匹配的代码块, 通常用于i18n等国际化的翻译工作

## Features


## Requirements
此插件没有任何依赖要求

## Extension Settings
This extension contributes the following settings:

* `geekLanguage.regexp`: 符合条件代码块的正则匹配查询, 默认情况下为`$L(${language}),t(${language})`
* `geekLanguage.resources`: 转译的资源路径, 支持`*.json, *.js`

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

1. `geekLanguage.languageUrl` 国际化内容请求接口, 填完整的请求中文的接口, 且无跨域要求
2. `geekLanguage.languageJSON` 本地如果有JSON语言包, 可以直接读本地的语言包
3. `geekLanguage.regexp` 内置了对$L()与t()这种写法的国际化检查, 如果项目中存在其他形式的国际化, 可以在这里进行设置

### 1.0.1

1. 不再支持请求多文件与URL请求, 可以使用插入`js`代码块或者直接插入JSON文件来得到国际化数据。
2. 左侧增加国际化数据目录, 能查询已存在的所有国际化数据, 并能够刷新/复制。
3. 增加设置匹配的文件类型设置, 只对指定的文件类型生效, 默认 .vue, .js。
4. 当使用指定的写法如`$L`, 如果内容是中文, 则提示出对应的代码, 可以一键填入, 如果找不到则提示需要新增。

### 1.0.3

1. 取消了国际化查询, 可以支持使用 js 文件来获得国际化数据
2. 新增检索功能, 一键检索未进行国际化的代码部分