/* 在这里获取git相关信息 */

import { GeekplusExpandConfig } from "./../interface";
import simpleGit from "simple-git";
import * as vscode from "vscode";
import store from "../store";

export async function loadResource(context: vscode.ExtensionContext) {
  const fsPath = store.getState("fsPath");
  const git = simpleGit(fsPath);

  const config: GeekplusExpandConfig["git"] = {
    remote: "",
    branch: "",
    originBranch: "",
    remoteList: [],
  };

  try {
    const status = await git.status();
    const remote = await git.init().remote(['-v']);
    config.remote = (remote as string);
    config.branch = status.current;
    config.originBranch = status.tracking;
    config.remoteList = (remote as string)
      .split("\n")
      .filter(item => item)
      .map(remoteItem => {
        const [, remoteUrl, remoteType] = /^origin\s{0,}([^\s]{0,})\s{0,}\((\w+)\)/.exec(remoteItem);
        return { remoteUrl, remoteType };
      });
  } catch (error) {
  }

  return config;
}
