import { getResetConfigure } from "../config/configure";
const transferred = ['(', ')', '{', '}', '[', ']', '$', '^', '|', '.', '"', "'"];

// 生产正则匹配的规则
export default function() {
  const { regexp } = getResetConfigure();
  return (regexp || '$L(${language}),t(${language})').split(',').map((text: string) => {
    const [textStart, textEnd] = text.split('${language}');
    return [...textStart].map((t) => {
      return transferred.includes(t) ? `\\${t}` : t;
    }).join('') +
    `['"]([^'"]+)['"]` +
    [...textEnd].map((t) => {
      return transferred.includes(t) ? `\\${t}` : t;
    }).join('');
  });
}
