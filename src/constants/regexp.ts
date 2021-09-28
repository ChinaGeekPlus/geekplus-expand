import store from "./store";

const transferred = ['(', ')', '{', '}', '[', ']', '$', '^', '|', '.', '"', "'"];

// 生产正则匹配的规则
export default function() {
  const i18nMatchRegexp = store.getState("i18nMatchRegexp");
  return (i18nMatchRegexp || '$L(${language}),t(${language})').split(',').map((text: string) => {
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
