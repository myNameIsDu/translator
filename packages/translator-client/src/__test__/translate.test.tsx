import { t } from '../translate';
import { setLocales, setLang } from '../info';

describe('t 函数', () => {
    afterEach(() => {
        setLocales({});
        setLang('zh');
    });
    beforeEach(() => {
        setLang('en');
    });
    describe('没有占位符', () => {
        it('当没有找到对应词条时，返回当前传入文案', () => {
            expect(t('文案')).toBe('文案');
        });
        it('当没有找到对应词条时，返回当前语言对应的翻译', () => {
            setLocales({
                文案: {
                    en: 'hello',
                    zh: '文案',
                },
            });
            expect(t('文案')).toBe('hello');
        });
        it('当指定 id 时，返回对于 id 的翻译', () => {
            setLocales({
                file: {
                    en: 'hello',
                    zh: '文案',
                },
            });
            expect(t('文案', { id: 'file' })).toBe('hello');
        });
    });

    describe('存在占位符', () => {
        it('当存在占位符时，不翻译占位符内内容', () => {
            setLocales({
                '文<holder1>案': {
                    en: 'text <holder1> text',
                    zh: '文<holder1>案',
                },
            });
            expect(t('文<hi>案')).toBe('text hi text');
        });

        it('当存在转义符时，占位符内内容作为正常文案翻译', () => {
            setLocales({
                '文/<hi/>案': {
                    en: 'text text text',
                    zh: '文/<hi/>案',
                },
            });
            expect(t('文/<hi/>案')).toBe('text text text');
        });
        it('当存在转义符时，渲染时去除转义符', () => {
            setLang('zh');
            setLocales({
                '文/<hi/>案': {
                    en: 'text text text',
                    zh: '文/<hi/>案',
                },
            });
            expect(t('文/<hi/>案')).toBe('文<hi>案');
        });
    });

    describe('存在 xml', () => {
        it('当存在 xml 时，替换函数返回的内容', () => {
            expect(
                t('共计<span>特殊</span><page>页', {
                    span: children => (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    ),
                }),
            ).toEqual([
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊
                </span>,
                'page页',
            ]);
        });

        it('当存在自闭合 xml 时，替换函数返回的内容', () => {
            expect(
                t('前<input/>%', {
                    input: () => {
                        return <input key="input" />;
                    },
                }),
            ).toEqual(['前', <input key="input" />, '%']);
        });

        it('当存在 多个 xml 时，替换函数返回的内容', () => {
            expect(
                t('共计<span>特殊</span><strong>标签</strong><page>页', {
                    span: children => (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    ),
                    strong: children => <strong key="strong">{children}</strong>,
                }),
            ).toEqual([
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊
                </span>,
                <strong key="strong">标签</strong>,
                'page页',
            ]);
        });

        it('当存在 嵌套 xml 时，替换函数返回的内容', () => {
            expect(
                t('共计<span>特殊<strong>标签</strong><input/></span><page>页', {
                    span: children => (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    ),
                    strong: children => <strong key="strong">{children}</strong>,
                    input: () => {
                        return <input key="input" />;
                    },
                }),
            ).toEqual([
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊<strong key="strong">标签</strong>
                    <input key="input" />
                </span>,
                'page页',
            ]);
        });

        it('当存在 嵌套多个 xml 时，替换函数返回的内容', () => {
            expect(
                t('共计<span><i>特殊</i><strong>标签</strong></span><page>页', {
                    span: children => (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    ),
                    strong: children => <strong key="strong">{children}</strong>,
                    i: children => <i key="i">{children}</i>,
                }),
            ).toEqual([
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    <i key="i">特殊</i>
                    <strong key="strong">标签</strong>
                </span>,
                'page页',
            ]);
        });

        it('当存在 xml 时，替换函数返回为纯字符串时，返回字符串', () => {
            expect(
                t('共计<span>特殊</span><page>页', {
                    span: c => `<span style='color:red'>${c}</span>`,
                }),
            ).toBe("共计<span style='color:red'>特殊</span>page页");
        });

        it('当 xml 中存在空格时，会被自动去除', () => {
            expect(
                t('共计<span >特殊<strong >标签</strong><input /></span><page>页', {
                    span: children => (
                        <span key="span" style={{ color: 'red' }}>
                            {children}
                        </span>
                    ),
                    strong: children => <strong key="strong">{children}</strong>,
                    input: () => {
                        return <input key="input" />;
                    },
                }),
            ).toEqual([
                '共计',
                <span key="span" style={{ color: 'red' }}>
                    特殊<strong key="strong">标签</strong>
                    <input key="input" />
                </span>,
                'page页',
            ]);
        });
    });
});
