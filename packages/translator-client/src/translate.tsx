import { holderFinder, matchHolderRegex } from '../../common/utils';
import { getLang, getLocales } from './info';

export interface TranslatePropsType {
    text: string;
    id?: string;
}

export function Translate({ text, id }: TranslatePropsType): JSX.Element {
    const currentLang = getLang();
    const locales = getLocales();
    const { extra, holder } = holderFinder(text);
    const realId = id || holder;

    const localesText = locales[realId]?.[currentLang] || holder;
    const resultText = localesText.replace(matchHolderRegex, (_, $1) => extra[$1]);

    return resultText as unknown as JSX.Element;
}

export interface TSecondParamsType {
    id?: string;
}
export function t(s: string, { id }: TSecondParamsType = {}): string {
    return Translate({ text: s, id }) as unknown as string;
}
