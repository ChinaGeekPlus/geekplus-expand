var exec = require("child_process").exec;

// 简单的复制文本到剪切板的函数，参数依次是文本，成功回调
export default function copyToClipboard(text) {
  // 这种方式最完美，但最麻烦
  // 会生成一个批处理文件，一个文本文件，以批处理文件复制文件文件的内容，后又需要删除两个文件。
  exec(`<nul (set/p z=${text}) | clip`, function (err, stdout, stderr) {
    console.log(err, stdout, stderr);
  });
}
