import { simpleHolderFinder, replaceHolderToRealText } from '../utils';

describe('simpleHolderFinder 识别 < > 转义符', () => {
    it('替换占位符', () => {
        expect(simpleHolderFinder('文<hello>案')).toEqual({
            extra: {
                holder1: 'hello',
            },
            holder: '文<holder1>案',
        });
    });
    it('存在转义符不替换', () => {
        expect(simpleHolderFinder('文/<hello/>案')).toEqual({
            extra: {},
            holder: '文/<hello/>案',
        });
    });
    it('替换多个占位符', () => {
        expect(simpleHolderFinder('文<hello>案文<hi>案')).toEqual({
            extra: {
                holder1: 'hello',
                holder2: 'hi',
            },
            holder: '文<holder1>案文<holder2>案',
        });
    });

    it('转义占位符符和占位符同时存在，只替换占位符', () => {
        expect(simpleHolderFinder('文/<hello/>案文<hi>案')).toEqual({
            extra: {
                holder1: 'hi',
            },
            holder: '文/<hello/>案文<holder1>案',
        });
    });

    it('只存在左转义符，则转义符当做正常文本替换', () => {
        expect(simpleHolderFinder('文/<hello>案')).toEqual({
            extra: {
                holder1: 'hello',
            },
            holder: '文/<holder1>案',
        });
    });

    it('只存在右转义符，则转义符当做正常文本替换', () => {
        expect(simpleHolderFinder('文<hello/>案')).toEqual({
            extra: {
                holder1: 'hello/',
            },
            holder: '文<holder1>案',
        });
    });
});

describe('replaceHolderToRealText 替换占位符为展示数据', () => {
    it('左右转义符同时存在，删除左右转义符', () => {
        expect(replaceHolderToRealText('文/<hello/>案', {})).toBe('文<hello>案');
    });
    it('对占位符使用真实文本替换', () => {
        expect(replaceHolderToRealText('文<holder1>案', { holder1: ' hi ' })).toBe('文 hi 案');
    });

    it('存在左转义符时，作为正常文本保留', () => {
        expect(replaceHolderToRealText('文/<holder1>案', { holder1: ' hi ' })).toBe('文/ hi 案');
    });
});
