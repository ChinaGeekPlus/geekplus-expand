### 结构
src:
    components  IDE各模块的定制代码
        statusBarItem   底部状态栏定制
        treeView        左侧tab定制
        treeViewContainer   左侧tab icon定制
        webview         webview定制
    
    constants   底层公共代码
        configuration   用来获取用户配置项
        subscriptions   对事件的处理
        interface       typescript变量声明
        resource        资源读取
        store           公共数据存储集合
        

    view        webview内嵌代码
        ...
    
    extension.ts    入口文件