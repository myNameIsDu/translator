export const supportLanguages = ['zh', 'en'] as const;
export type SupportLanguagesType = typeof supportLanguages[number];

export type LocalesItemType = Record<SupportLanguagesType, string>;
export type LocalesType = Record<string, LocalesItemType>;

export type RecordItemType = { id: string; zh: string };
export type RecordType = RecordItemType[];
