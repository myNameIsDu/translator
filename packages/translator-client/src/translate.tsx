import { holderFinder, matchHolderRegex } from "../../common/utils";
import { getLang, getLocales } from "./info";

export interface TranslatePropsType {
  text: string;
  id?: string;
}

export function Translate({ text, id }: TranslatePropsType): JSX.Element {
  const currentLang = getLang();
  const locales = getLocales();
  const { extra, holder } = holderFinder(text);
  const realId = id || holder;

  if (!locales[realId] && process.env.NODE_ENV === "development") {
    console.log(
      "%c" +
        (realId === text
          ? `文案'${text}'未找到对应翻译`
          : `文案'${text}'(id: '${realId}') 未找到对应翻译`),
      "color:red; font-weight: 600;"
    );
  }
  const localesText = locales[realId]?.[currentLang] || holder;
  const resultText = localesText.replace(
    matchHolderRegex,
    (_, $1) => extra[$1]
  );

  return resultText as unknown as JSX.Element;
}

export interface TSecondParamsType {
  id?: string;
}
export function t(s: string, { id }: TSecondParamsType = {}): string {
  return Translate({ text: s, id }) as unknown as string;
}
