import { ReactElement } from "react";
import { type LocalesType } from "../../common/config";
import { setLocales } from "./info";

interface I18nextProviderPropsType {
  locales: LocalesType;
  children: ReactElement;
}

export function I18nProvider({ children, locales }: I18nextProviderPropsType) {
  setLocales(locales);
  return children;
}
