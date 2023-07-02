import { getTCalledTextAndId } from '../parser-t';

describe('获取 t 函数调用的文本参数和 id 参数', () => {
    it.each([
        ['t("我是文案")', '我是文案', undefined, undefined],
        ['t("我是文案",{id:"我是 id"})', '我是文案', '我是 id', undefined],
        ["t('我是文案', { id : '我是 id', a:'a'})", '我是文案', '我是 id', undefined],
        ["t('我是文案', { span:()=>'xxx'})", '我是文案', undefined, true],

        ['t(`我<${name}>案`)', '我<${name}>案', undefined, undefined],
    ])('匹配 %s 中的 %s 和 %s', (content, text, id, replaceXml) => {
        const matchedResults = getTCalledTextAndId(content);
        expect(matchedResults).toEqual([{ text, id, replaceXml }]);
    });
});
