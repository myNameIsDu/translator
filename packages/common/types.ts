export type ExtraType = Record<`holder${number}`, string>;

export type NormalText = {
    type: 'normal';
    text: string;
};
export type LabelText = {
    type: 'xml';
    text: string;
    closed: boolean;
    couple: number;
};
export type HolderText = {
    type: `holder${number}`;
    text: string;
};

export type DistinguishedItemType = NormalText | LabelText | HolderText;
