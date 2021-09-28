
import * as vscode from "vscode";
import parseRegexp from "../regexp";

const regexpList = parseRegexp();

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
export default function provideHover(document, position, token) {
    const word = document.getText(document.getWordRangeAtPosition(position));
    console.log(word, position);
    for (let index = regexpList.length - 1; index >= 0; index --) {
      const regexp = regexpList[index];
      const checkRegexp = new RegExp(regexp, 'g');

      if (new RegExp(regexp).test(word)) {
        let lineMatchTextInfo = checkRegexp.exec(word);
        return new vscode.Hover(`*i18n`);
      }
    }
}
