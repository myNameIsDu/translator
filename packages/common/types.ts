export type ExtraType = Record<`holder${number}`, string>;

export type NormalText = {
    type: 'normal';
    text: string;
};
export type CoupleLabelText = {
    type: 'xml';
    text: string;
    closed: boolean;
    couple: number;
};
export type ClosedSelfLabelText = {
    type: 'xml';
    text: string;
    closedSelf: true;
};
export type HolderText = {
    type: `holder${number}`;
    text: string;
};

export type DistinguishedItemType = NormalText | CoupleLabelText | ClosedSelfLabelText | HolderText;
