import { getHolderAndExtraFromAst } from '../get-holder-and-extra';
import type { DistinguishedItemType } from '../types';

describe('getHolderAndExtraFromAst 生成 holder 和 extra', () => {
    it.each([
        [
            [
                {
                    type: 'xml',
                    closed: false,
                    text: 'span',
                    couple: 2,
                },
                {
                    type: 'normal',
                    text: '特殊',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'span',
                    couple: 0,
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'a',
                    couple: 5,
                },
                {
                    type: 'normal',
                    text: '链接',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'a',
                    couple: 3,
                },
                {
                    type: 'xml',
                    text: 'input',
                    closedSelf: true,
                },
                {
                    type: 'normal',
                    text: '共计',
                },
                {
                    type: 'holder1',
                    text: 'page',
                },
                {
                    type: 'normal',
                    text: '页',
                },
            ],
            '<span>特殊</span><a>链接</a><input/>共计<holder1>页',
            { holder1: 'page' },
        ],
    ])('根据 %j 生成 holder %s 和 extra %s', (ast, holder, extra) => {
        expect(getHolderAndExtraFromAst(ast as DistinguishedItemType[])).toEqual({
            holder,
            extra,
        });
    });
});
