import { window } from "vscode";
import store from "../store";
import { executeApi } from '../../components/webview/apis';

/**
 * 错误重试
 * @param time 重试时间
 */
function catchError(time: number) {
  window.showInformationMessage('自动拉取i18n时出错, 服务器可能无法连接, 自动拉取暂时停止, 重启IDE后重新开始自动拉取', '知道了')
    .then(() => {
      // autoUpateProjectI18nDataFn(time);
    });
}

function autoUpateProjectI18nDataFn(time: number) {
  const geekExpandConfig = store.getState('geekExpandConfig');
  executeApi('updateProjectI18nData', { type: geekExpandConfig.projectId })
    .then((data) => {
      if (!data) {
        catchError(geekExpandConfig.autoPattern);
      } else if (time) {
        setTimeout(() => autoUpateProjectI18nDataFn(time), time);
      }
    })
    .catch(() => catchError(time));
}

export default function geekExpandConfigHandle() {
  // 当 geekExpandConfig 变更, 自动开启定时器做轮询查询i18n
  const geekExpandConfig = store.getState('geekExpandConfig');
  const { autoPattern } = geekExpandConfig;
  let time = 0;
  switch(autoPattern) {
    case 'none': return;
    case 'init': time = 0; break;
    case '5s': time = 5000; break;
    case '30s': time = 30000; break;
    case '60s': time = 60000; break;
    case '300s': time = 300000; break;
  }

  // i18n自动拉取
  autoUpateProjectI18nDataFn(time);
}
