import { holderFinder, matchHolderRegex } from "../../common/utils";
import { getLang, getLocales } from "./info";

interface TranslatePropsType {
  text: string;
  key?: string;
}

export function Translate({ text, key }: TranslatePropsType): JSX.Element {
  const currentLang = getLang();
  const locales = getLocales();
  const { extra, holder } = holderFinder(text);
  const realKey = key || holder;

  if (!locales[realKey] && process.env.NODE_ENV === "development") {
    console.log(
      "%c" +
        (realKey === text
          ? `文案'${text}'未找到对应翻译`
          : `文案'${text}'(key: '${realKey}') 未找到对应翻译`),
      "color:red; font-weight: 600;"
    );
  }
  const localesText = locales[realKey]?.[currentLang] || holder;
  const resultText = localesText.replace(
    matchHolderRegex,
    (_, $1) => extra[$1]
  );

  return resultText as unknown as JSX.Element;
}

interface TSecondParamsType {
  key?: string;
}
export function t(s: string, { key }: TSecondParamsType = {}): string {
  return Translate({ text: s, key }) as unknown as string;
}
