import type { ExtraType, HolderText, DistinguishedItemType } from './types';

export type SplitItemType =
    | {
          type: 'label';
          withClosedSign: boolean;
          text: string;
      }
    | {
          type: 'label';
          closedSelf: true;
          text: string;
      }
    | {
          type: 'normal';
          text: string;
      };

/**
 *
 * @param v
 * @returns  DistinguishedItemType[]
 * @description
 *  1. 区分 label 类型中的 xml 和 holder
 *  2. 如果传入 extra 则使用 extra 中的文本替换 holder
 */
const distinguishItems = (v: SplitItemType[], extra?: ExtraType): DistinguishedItemType[] => {
    const distinguishedText: DistinguishedItemType[] = [];
    const coupleIndexCache: { start: number; end: number }[] = [];
    let holderIndex = 1;
    for (let index = 0; index < v.length; index++) {
        const element = v[index];
        if (element.type === 'label') {
            if ('withClosedSign' in element) {
                if (element.withClosedSign) {
                    const couple = coupleIndexCache.find(v => v.end === index);
                    if (couple) {
                        distinguishedText.push({
                            type: 'xml',
                            // xml 标签内会出现有空格的情况，所以需要去掉
                            text: element.text.trim(),
                            couple: couple.start,
                            closed: true,
                        });
                    } else {
                        /**
                         * 这里已经判断了是 withClosedSign(即是以 / 开头) 所以不可能是 `holder{string}` 类型
                         */
                        // if (extra) {
                        //   distinguishedText.push({
                        //     type: element.text as HolderText['type'],
                        //     text: extra[element.text as keyof ExtraType],
                        //   });
                        // } else {
                        distinguishedText.push({
                            type: `holder${holderIndex}`,
                            /**
                             * 由于没有找到对应的 couple (起始标签)，所以这个节点的类型为 holder, 这里的 text 需要加上 /
                             * 因为上一步在做解析的时候判断是标签，并且带有 / 开头，所以标记 withClosedSign 为 true，并且去掉了 / 作为文案
                             */
                            text: '/' + element.text,
                        });
                        holderIndex++;
                        // }
                    }
                } else {
                    const closedIndex = v.findIndex(
                        v =>
                            v.type === 'label' &&
                            'withClosedSign' in v &&
                            v.withClosedSign &&
                            // xml 标签内会出现有空格的情况，所以需要去掉
                            v.text.trim() === element.text.trim(),
                    );
                    if (closedIndex !== -1) {
                        distinguishedText.push({
                            type: 'xml',
                            // xml 标签内会出现有空格的情况，所以需要去掉
                            text: element.text.trim(),
                            couple: closedIndex,
                            closed: false,
                        });
                        coupleIndexCache.push({ start: index, end: closedIndex });
                    } else {
                        if (extra) {
                            distinguishedText.push({
                                type: element.text as HolderText['type'],
                                text: extra[element.text as keyof ExtraType],
                            });
                        } else {
                            distinguishedText.push({
                                type: `holder${holderIndex}`,
                                text: element.text,
                            });
                            holderIndex++;
                        }
                    }
                }
            } else {
                // 自闭合 xml 标签
                distinguishedText.push({
                    type: 'xml',
                    // xml 标签内会出现有空格的情况，所以需要去掉
                    text: element.text.trim(),
                    closedSelf: true,
                });
            }
        } else {
            distinguishedText.push(element);
        }
    }
    return distinguishedText;
};

/**
 *
 * @param v 要翻译的文案
 * @returns 根据 < > 分割的字符
 * @example <a>xx</a>bbb<c><d/>   =>
 * [
 *   { type: 'label', withClosedSign: false, text: 'a' },
 *   { type: 'normal', text: 'xx' },
 *   { type: 'label', withClosedSign: true, text: 'a' },
 *   { type: 'normal', text: 'bbb' },
 *   { type: 'label', withClosedSign: false, text: 'c' }
 *   { type: 'label', 'd', closedSelf: true }
 *  ]
 */
export const simpleSplitWithSign = (v: string): SplitItemType[] => {
    const splitText: SplitItemType[] = [];
    let point = 0;
    let startIndex = 0;
    let signStartIndex: null | number = null;
    while (v[point]) {
        const currentCharacter = v[point];
        const lastCharter = v[point - 1];
        if (currentCharacter === '<' && lastCharter !== '/') {
            signStartIndex = point;
        }
        if (currentCharacter === '>') {
            if (signStartIndex !== null) {
                const sign = v.slice(signStartIndex + 1, point);
                const normalCharacter = v.slice(startIndex, signStartIndex);
                normalCharacter &&
                    splitText.push({
                        type: 'normal',
                        text: normalCharacter,
                    });

                if (lastCharter !== '/') {
                    const signWithClosed = sign.startsWith('/');
                    splitText.push({
                        type: 'label',
                        withClosedSign: signWithClosed,
                        text: signWithClosed ? sign.slice(1) : sign,
                    });
                } else {
                    splitText.push({
                        type: 'label',
                        text: sign.slice(0, sign.length - 1),
                        closedSelf: true,
                    });
                }

                startIndex = point + 1;
                signStartIndex = null;
            }
        }
        point++;
    }
    const lastNormalCharacter = v.slice(startIndex);
    lastNormalCharacter &&
        splitText.push({
            type: 'normal',
            text: lastNormalCharacter,
        });
    return splitText;
};

/**
 * @param v string
 * @returns DistinguishedItemType []
 * @description
 *    1. 传入文本 返回 DistinguishedItemType 形式的数组
 *    2. 传入翻译后的 文案 Future <holder1> year 和 extra {holder1: 1} 则使用 extra 替换 holder 为正常文案并返回 DistinguishedItemType
 */
export const splitText = (v: string, extra?: ExtraType) =>
    distinguishItems(simpleSplitWithSign(v), extra);
