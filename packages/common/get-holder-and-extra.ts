import { type DistinguishedItemType, type HolderText } from './types';
import type { ExtraType } from './types';
/**
 * @param v
 * @returns string
 * @description 拼接 holderId 并返回 extra
 */
export const getHolderAndExtraFromAst = (v: DistinguishedItemType[]) => {
    let holder = '';
    const extra: ExtraType = {};
    v.forEach(element => {
        if (element.type === 'normal') {
            holder += element.text;
        }
        if (element.type === 'xml') {
            if ('closedSelf' in element) {
                holder += `<${element.text}/>`;
            } else {
                if (element.closed) {
                    holder += `</${element.text}>`;
                } else {
                    holder += `<${element.text}>`;
                }
            }
        }
        if (element.type.startsWith('holder')) {
            holder += `<${element.type}>`;
            extra[(element as HolderText).type] = element.text;
        }
    });
    return { holder, extra };
};
