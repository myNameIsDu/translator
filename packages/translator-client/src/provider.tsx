import { ReactElement } from "react";
import { type LocalesType } from "../../common/config";
import { setLocales } from "./info";

export interface TranslatorProviderPropsType {
  locales: LocalesType;
  children: ReactElement;
}

export function TranslatorProvider({
  children,
  locales,
}: TranslatorProviderPropsType) {
  setLocales(locales);
  return children;
}
