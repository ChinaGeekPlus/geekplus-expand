import * as fs from "fs";
import * as path from "path";

/**
 * 这里是对1.0.0之前的插件用户而生产的迁移方案
 * 仅移动文件中的config.json, resource/i18n.json
 * @param fsPath 项目路径
 */
export default function(fsPath: string) {
  const oldPath = path.join(fsPath, '/.geekplusExpand');
  const newPath = path.join(fsPath, '/.vscode/geekplusExpand');
  const vscodeFiles = path.join(fsPath, '/.vscode');
  const vscodeResourceFiles = path.join(newPath, '/resource');

  // 检查是否存在.vscode目录 没有则创建
  try {
    fs.accessSync(vscodeFiles, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(vscodeFiles);
  }

  try {
    fs.accessSync(newPath, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(newPath);
  }

  try {
    fs.accessSync(vscodeResourceFiles, fs.constants.W_OK);
  } catch (error) {
    fs.mkdirSync(vscodeResourceFiles);
  }

  // 检查config是否存在
  try {
    fs.accessSync(path.join(oldPath, 'config.json'), fs.constants.W_OK);
    fs.renameSync(path.join(oldPath, 'config.json'), path.join(newPath, 'config.json'));
  } catch (error) {}

  // 检查i18n是否存在
  try {
    fs.accessSync(path.join(oldPath, '/resource/i18n.json'), fs.constants.W_OK);
    fs.renameSync(path.join(oldPath, '/resource/i18n.json'), path.join(vscodeResourceFiles, '/i18n.json'));
  } catch (error) {}

  // 删除 oldPath
  fs.rmdirSync(oldPath, { recursive: true });
}