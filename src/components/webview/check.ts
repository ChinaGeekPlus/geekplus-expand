import * as fs from "fs";
import * as path from "path";

import * as glob from "glob";

import store from "../../constants/store";
import FileContent from "./fileContent";
import { window } from "vscode";

let gitignoreList = ["node_modules"];

// 先取忽略数据
export function getGitignores() {
    const fsPath = store.getState("fsPath");
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(path.join(fsPath, '.gitignore')), "utf8", (err, gitignoreStr) => {
            if (!err) {
                gitignoreList = gitignoreStr.replace(/\s+/g, "|").split("|").filter(item => item);
            }
            resolve(gitignoreList);
        });
    });
}

export function ergodicFiles(panel) {
    const fsPath = store.getState("fsPath");
    const cwd = path.resolve(fsPath);
    const ignore = parseIgnore(gitignoreList);
    return new Promise((resolve, reject) => {
        return new glob.Glob('**/*.{js,vue,ts}', { dot: true, cwd, ignore }, (error, matches) => {
            if (error) {
                panel.webview.postMessage({ type: "error", message: `没有可匹配的文件, 任务失败！` });
                reject(error);
            } else {
                resolve(matches);
            }
        });
    });
}

// 检查整个文件
export function checkFileContent(fileUrl) {
    const fileCont = new FileContent(fileUrl);
    return fileCont.checkView();
}

export function checkFileLineContent(lineIndex) {

}

// Checks whether a pattern is probably not a path e.g. a file.
function isFile(pattern) {
    if ([".history"].includes(pattern)) {
        return false;
    }
    return (pattern === '*' || pattern.indexOf('.') !== -1);
}

// Map transforms .gitignore patterns into globs.
function parseIgnore(patterns) {
    // Account for files and directories.
    return patterns.map(function(pattern) {
        if (!isFile(pattern)) {
            return `**/${pattern}/**/*.*`;
        } else {
            return `**/${pattern}`;
        }
    });;
}