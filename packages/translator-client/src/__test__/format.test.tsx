import { format, type FormattedResult } from '../format';
import type { DistinguishedItemType } from '../../../common/types';

describe('form 拼接 ast 和 replaceXml', () => {
    it.each([
        [
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
            {},
            '共计page页',
        ],
        [
            [
                {
                    type: 'normal',
                    text: '共计',
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'span',
                    couple: 3,
                },
                {
                    type: 'normal',
                    text: '特殊',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'span',
                    couple: 1,
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
            {
                span: (children: FormattedResult) => {
                    return (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    );
                },
            },
            [
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊
                </span>,
                'page页',
            ],
        ],

        [
            [
                {
                    type: 'normal',
                    text: '共计',
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'span',
                    couple: 3,
                },
                {
                    type: 'normal',
                    text: '特殊',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'span',
                    couple: 1,
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
            {
                span: (children: FormattedResult) => {
                    return (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    );
                },
            },
            [
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊
                </span>,
                'page页',
            ],
        ],
        [
            [
                {
                    type: 'normal',
                    text: '共计',
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'span',
                    couple: 3,
                },
                {
                    type: 'normal',
                    text: '特殊',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'span',
                    couple: 1,
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'bold',
                    couple: 6,
                },
                {
                    type: 'normal',
                    text: '标签',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'bold',
                    couple: 4,
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
            {
                span: (children: FormattedResult) => {
                    return (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    );
                },
                bold: (children: FormattedResult) => {
                    return <strong key="strong">{children}</strong>;
                },
            },
            [
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊
                </span>,
                <strong key="strong">标签</strong>,
                'page页',
            ],
        ],
        [
            [
                {
                    type: 'normal',
                    text: '共计',
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'span',
                    couple: 6,
                },
                {
                    type: 'normal',
                    text: '特殊',
                },
                {
                    type: 'xml',
                    closed: false,
                    text: 'bold',
                    couple: 5,
                },
                {
                    type: 'normal',
                    text: '标签',
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'bold',
                    couple: 3,
                },
                {
                    type: 'xml',
                    closed: true,
                    text: 'span',
                    couple: 1,
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
            {
                span: (children: FormattedResult) => {
                    return (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    );
                },
                bold: (children: FormattedResult) => {
                    return <strong key="strong">{children}</strong>;
                },
            },
            [
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊<strong key="strong">标签</strong>
                </span>,
                'page页',
            ],
        ],
    ])('转换 ast %j replaceXml %s 为 %s', (ast, replaceXml, result) => {
        expect(format(ast as DistinguishedItemType[], replaceXml)).toEqual(result);
    });
});
