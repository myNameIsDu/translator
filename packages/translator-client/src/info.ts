import { LocalesType } from '../../common/config';
import { type SupportLanguagesType, supportLanguages } from '../../common/config';

/*
  这里抛弃使用 react context 传递的方法，因为这样会强依赖 react 上下文
  比如在使用一些库时会出现问题：Yup，但是这样做的弊端在于只能使用 location.reload 刷新页面
*/

export let locales: LocalesType = {};

export let lang = ((): SupportLanguagesType => {
    const storageLang = localStorage.getItem('lang');
    if (storageLang && supportLanguages.includes(storageLang as any)) {
        return storageLang as SupportLanguagesType;
    }
    let willSetLang: SupportLanguagesType = navigator.language.includes('zh') ? 'zh' : 'en';
    localStorage.setItem('lang', willSetLang);
    return willSetLang;
})();

export const setLocales = (nextLocales: LocalesType) => {
    locales = nextLocales;
};

export const getLocales = () => {
    return locales;
};

export const getLang = () => {
    return lang;
};

export const setLang = (nextLang: SupportLanguagesType) => {
    localStorage.setItem('lang', nextLang);
    lang = nextLang;
};
