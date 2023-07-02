import { splitText } from '../split-text';

describe('splitText 分割字符', () => {
    describe('传入原始文案', () => {
        it.each([
            [
                '一段文案',
                [
                    {
                        type: 'normal',
                        text: '一段文案',
                    },
                ],
            ],

            [
                '共计<page>页',
                [
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
            ],
            [
                '共计页<page>',
                [
                    {
                        type: 'normal',
                        text: '共计页',
                    },
                    {
                        type: 'holder1',
                        text: 'page',
                    },
                ],
            ],
            [
                '<page>共计页',
                [
                    {
                        type: 'holder1',
                        text: 'page',
                    },
                    {
                        type: 'normal',
                        text: '共计页',
                    },
                ],
            ],

            [
                '共计/<page/>页',
                [
                    {
                        type: 'normal',
                        text: '共计/<page/>页',
                    },
                ],
            ],
            [
                '共计<page/>页',
                [
                    {
                        type: 'normal',
                        text: '共计<page/>页',
                    },
                ],
            ],
            [
                '共计/<page>页',
                [
                    {
                        type: 'normal',
                        text: '共计/<page>页',
                    },
                ],
            ],
            [
                '<span>特殊</span>共计<page>页',
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
            ],
            [
                '<span>特殊</span><a>链接</a>共计<page>页',
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
            ],
            [
                '<span>特殊</span>/<a>链接</a>共计<page>页',
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
                        type: 'normal',
                        text: '/<a>链接',
                    },
                    {
                        type: 'holder1',
                        text: '/a',
                    },
                    {
                        type: 'normal',
                        text: '共计',
                    },
                    {
                        type: 'holder2',
                        text: 'page',
                    },
                    {
                        type: 'normal',
                        text: '页',
                    },
                ],
            ],
        ])('分割 %s', (text, result) => {
            expect(splitText(text)).toEqual(result);
        });
    });

    describe('传入有 holder 的文案，和 extra', () => {
        it.each([
            [
                'Future <holder1> year',
                { holder1: '1' },
                [
                    {
                        type: 'normal',
                        text: 'Future ',
                    },
                    {
                        type: 'holder1',
                        text: '1',
                    },
                    {
                        type: 'normal',
                        text: ' year',
                    },
                ],
            ],
        ])('分割 %s 传入 extra %s', (text, extra, result) => {
            expect(splitText(text, extra)).toEqual(result);
        });
    });
});
