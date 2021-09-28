// 所有页面中的展示在这里
import * as vscode from "vscode";

import store from "./store";
import parseRegexp from "./regexp";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Position, window } = vscode;
const decorationType = window.createTextEditorDecorationType({
  after: { margin: "0 0 0 0.5rem" },
});
let decorationsDebounce: NodeJS.Timeout,
  originDecorations = {},
  decorations = {},
  regexpList = [];

// 获取用户正则数据
regexpList = parseRegexp();

// 进行一次重绘
export function didChangeTextDocument() {
  const i18nResources = store.getState("i18nResources");

  // 当前有激活的文档
  if (window.activeTextEditor) {
    const { document } = window.activeTextEditor;
    const text = document.getText();
    const fileName = document.fileName;
    const lineText = text.split("\n");

    // fileName
    decorations[fileName] = {};

    lineText.forEach((text, index) => {
      lineTextCheck(text, index + 1, fileName, i18nResources);
    });

    // 渲染到vscode
    refreshDecorations(fileName);
  }
}

// 行处理
// 对每行进行匹配, 找到匹配项就进行转译, 并添加到渲染队列
function lineTextCheck(text, line, fileName, languageInfo) {
  for (let index = regexpList.length - 1; index >= 0; index--) {
    const regexp = regexpList[index];
    const checkRegexp = new RegExp(regexp, "g");

    if (new RegExp(regexp).test(text)) {
      // 找到匹配内容
      let lineMatchTextInfo = checkRegexp.exec(text);
      do {
        // 转译成中文
        const lineMatchText = lineMatchTextInfo[0];
        const lineMatchTextCN = parseCN(lineMatchText, regexp, languageInfo);

        // 找到转译内容(有可能翻译失败
        if (lineMatchTextCN) {
          const lineMatchIndex = lineMatchTextInfo.index + lineMatchText.length;
          // 添加到渲染队列
          decorate(lineMatchTextCN, { fileName, line, lineMatchIndex });
        }
        lineMatchTextInfo = checkRegexp.exec(text);
      } while (lineMatchTextInfo);
      return true;
    }
  }
}

// 翻译
function parseCN(lineMatchText, regexpText, languageInfo) {
  const textInfo = new RegExp(regexpText).exec(lineMatchText);
  if (textInfo) {
    const text = textInfo[1];
    return languageInfo[text];
  }
}

// 添加到任务队列
function decorate(text, packageInfo, color = "#67C23A") {
  const { fileName, line } = packageInfo;
  decorations[fileName] || (decorations[fileName] = {});
  decorations[fileName][line] || (decorations[fileName][line] = []);

  decorations[fileName][line].push({
    renderOptions: { after: { contentText: text, color } },
    range: new vscode.Range(
      new Position(line - 1, packageInfo.lineMatchIndex),
      new Position(line - 1, packageInfo.lineMatchIndex)
    ),
  });
}

// 渲染
function refreshDecorations(fileName, delay = 10) {
  const fileDecorations = decorations[fileName]; // 本次修改数据
  const fileOriginDecorations = originDecorations[fileName] || []; // 上次修改数据

  if (!fileOriginDecorations) {
    originDecorations[fileName] = fileDecorations;
  }

  Object.keys(fileDecorations).forEach((line) => {
    const fileDecorationList = fileDecorations[line];
    fileOriginDecorations[line] = fileDecorationList;
  });

  // 处理删除line的清空
  Object.keys(fileOriginDecorations).forEach((line) => {
    if (!fileDecorations[line]) {
      fileOriginDecorations[line] = [
        {
          renderOptions: { after: { contentText: "" } },
          range: new vscode.Range(
            new Position(Number(line) - 1, 1000),
            new Position(Number(line) - 1, 1000)
          ),
        },
      ];
    }
  });

  if (decorationsDebounce) {
    clearTimeout(decorationsDebounce);
    decorationsDebounce = null;
  }
  decorationsDebounce = setTimeout(
    () =>
      getEditors(fileName).forEach((editor) => {
        // 渲染
        const decorationList = [];

        Object.keys(fileOriginDecorations).forEach((line) => {
          decorationList.push(...fileOriginDecorations[line]);
        });
        // 渲染到vscode
        editor.setDecorations(decorationType, decorationList);
        originDecorations[fileName] = fileDecorations;
      }),
    delay
  );
}

// 获取打开的文档
function getEditors(fileName) {
  return vscode.window.visibleTextEditors.filter(
    (editor) => editor.document.fileName === fileName
  );
}
