/**
 * 获取翻译文件最终得到一个JSON, 异步
 */
import * as fs from "fs";
import * as path from "path";
import { getResetConfigure } from "../../config/configure";
import * as vscode from 'vscode';

let resourcesMap = {}, isUpdateResources = false, waitTimer: NodeJS.Timeout;

/**
 * 获取路径资源 JSON
 * @param filePath 本地路径
 */
export function loadResource() {
	const configure = getResetConfigure();
	const dirname = vscode.workspace.workspaceFolders[0] || { uri: { fsPath: "" } };

	return new Promise((resolve, reject) => {
		const resources = configure.resources.replace("${workspaceFolder}", dirname.uri.fsPath);

    // 如果是js, 则用
    if (resources.endsWith(".js")) {
      try {
        const resourcesFs = require(resources);
        resourcesFs(vscode).then((data) => {
          isUpdateResources = true;
          resourcesMap = data;
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    } else {
      fs.readFile(path.resolve(resources), (error, data) => {
        isUpdateResources = true;
        if (error) {
          reject(error);
        } else {
          resourcesMap = JSON.parse(data.toString());
          resolve(resourcesMap);
        }
      });
    }
	});
}

/**
 * 等待数据加载完成, 然后触发 resolve
 * @returns Promise
 */
export function getResource() {
	return new Promise((resolve) => {
		if (isUpdateResources) {
			resolve(resourcesMap);
		} else {
			waitTimer = setInterval(() => {
				if (isUpdateResources) {
					resolve(resourcesMap);
					clearInterval(waitTimer);
				}
			}, 300);
		}
	});
}
