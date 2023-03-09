import { simpleHolderFinder, replaceHolderToRealText } from '../../common/utils';
import { getLang, getLocales } from './info';

export interface TranslatePropsType {
    text: string;
    id?: string;
}

export function Translate({ text, id }: TranslatePropsType): JSX.Element {
    const currentLang = getLang();
    const locales = getLocales();
    const { extra, holder } = simpleHolderFinder(text);
    const realId = id || holder;

    const translatedText = locales[realId]?.[currentLang] || holder;
    // 替换 holder 为动态内容，并且删除转义符
    const resultsText = replaceHolderToRealText(translatedText, extra);

    return resultsText as unknown as JSX.Element;
}

export interface TSecondParamsType {
    id?: string;
}
export function t(s: string, { id }: TSecondParamsType = {}): string {
    return Translate({ text: s, id }) as unknown as string;
}
