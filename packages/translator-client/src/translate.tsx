import { simpleHolderFinder, replaceHolderToRealText } from '../../common/utils';
import { splitText } from '../../common/split-text';
import { getHolderAndExtraFromAst } from '../../common/get-holder-and-extra';
import { getLang, getLocales } from './info';
import { format, type ReplaceXmlObjType } from './format';

export interface TranslatePropsType {
    text: string;
    id?: string;
}

export function Translate({
    text,
    id,
    replaceXml = {},
}: TranslatePropsType & { replaceXml?: ReplaceXmlObjType }): JSX.Element {
    const currentLang = getLang();
    const locales = getLocales();

    // 不存在 replaceXml 对象直接用正则做简单解析
    if (Object.keys(replaceXml).length === 0) {
        const { extra, holder } = simpleHolderFinder(text);
        const realId = id || holder;

        const translatedText = locales[realId]?.[currentLang] || holder;

        // 替换 holder 为动态内容，并且删除转义符
        const resultsText = replaceHolderToRealText(translatedText, extra);

        return resultsText as unknown as JSX.Element;
    } else {
        const distinguishText = splitText(text);
        const { holder, extra } = getHolderAndExtraFromAst(distinguishText);

        const realId = id || holder;

        const translatedText = locales[realId]?.[currentLang] || holder;
        const distinguishTranslatedText = splitText(translatedText, extra);
        return format(distinguishTranslatedText, replaceXml) as unknown as JSX.Element;
    }
}

export interface IdParamsType {
    id?: string;
}
export function t(s: string, { id, ...replaceXml }: IdParamsType & ReplaceXmlObjType = {}): string {
    return Translate({ text: s, id, replaceXml }) as unknown as string;
}
