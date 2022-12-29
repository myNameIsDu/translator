export const supportLanguages = ["zh-CN", "en-US"] as const;
export type SupportLanguagesType = typeof supportLanguages[number];

export type LocalesItemType = Record<typeof supportLanguages[number], string>;
export type LocalesType = Record<string, LocalesItemType>;

export type RecordItemType = { key: string; "zh-CN": string };
export type RecordType = RecordItemType[];
