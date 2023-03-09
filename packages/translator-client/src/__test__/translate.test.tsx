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
});
