// 创建树形菜单
import {
  TreeDataProvider,
  Event,
  EventEmitter,
  TreeItem,
  TreeItemCollapsibleState,
  ProviderResult,
  commands,
  window,
} from "vscode";

import store from "../../constants/store";
let nodeDependenciesProvider;

class DataProvider implements TreeDataProvider<DataItem> {
  private _onDidChangeTreeData: EventEmitter<
    DataItem | undefined | null | void
  > = new EventEmitter<DataItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<DataItem | undefined | null | void> =
    this._onDidChangeTreeData.event;
  data: DataItem[];
  loadCallback: Function;

  constructor() {
    this.data = [];

    // 获取用户资源
    const i18nResources = store.getState("i18nResources");
    // 创建树形结构
    Object.keys(i18nResources).forEach((key) => {
      const value = i18nResources[key];
      this.data.push(new DataItem(`${key}: ${value}`));
    });
  }

  getTreeItem(element: DataItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: DataItem | undefined): ProviderResult<DataItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  // 刷新
  refresh() {
    // this.data = [];

    // return loadResource().then(() => {
    //   getResource().then((languageInfo) => {
    //     // 创建树形结构
    //     Object.keys(languageInfo).forEach((key) => {
    //       const value = languageInfo[key];
    //       this.data.push(new DataItem(`${key}: ${value}`));
    //     });

    //     this._onDidChangeTreeData.fire();
    //   });
    // });
  }
}

class DataItem extends TreeItem {
  public children: DataItem[] | undefined;

  constructor(label: string, children?: DataItem[] | undefined) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Collapsed
    );
    this.children = children;
  }
}

export function initTree() {
  nodeDependenciesProvider = new DataProvider();
  commands.executeCommand("setContext", "geek-on-i18n-language-tree", 1);
  window.registerTreeDataProvider(
    "geek-locales-tree",
    nodeDependenciesProvider
  );
}

export function refreshTree() {
  nodeDependenciesProvider.refresh();
}
