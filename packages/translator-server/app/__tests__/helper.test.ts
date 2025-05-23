import { matchTranslateRegex } from '../helper';

describe('Translate 正则匹配文件中的 文案 和 id', () => {
    afterEach(() => {
        matchTranslateRegex.lastIndex = 0;
    });
    it.each([
        // "
        ['<Translate text="我是文案" />', '我是文案', undefined],

        ['<Translate key="key" text="我是文案" />', '我是文案', undefined],
        ['<Translate text="我是文案" key="key" />', '我是文案', undefined],

        ['<Translate text="我是文案" id="我是 id"/>', '我是文案', '我是 id'],
        ['<Translate id="我是 id" text="我是文案" />', '我是文案', '我是 id'],

        ['<Translate key="key" id="我是 id" text="我是文案" />', '我是文案', '我是 id'],
        ['<Translate  id="我是 id" key="key" text="我是文案" />', '我是文案', '我是 id'],
        ['<Translate  id="我是 id" text="我是文案" key="key" />', '我是文案', '我是 id'],

        // '
        ["<Translate text='我是文案' />", '我是文案', undefined],

        ["<Translate key='key' text='我是文案' />", '我是文案', undefined],
        ["<Translate text='我是文案' key='key' />", '我是文案', undefined],

        ["<Translate text='我是文案' id='我是 id'/>", '我是文案', '我是 id'],
        ["<Translate id='我是 id' text='我是文案' />", '我是文案', '我是 id'],

        ["<Translate key='key' id='我是 id' text='我是文案' />", '我是文案', '我是 id'],
        ["<Translate  id='我是 id' key='key' text='我是文案' />", '我是文案', '我是 id'],
        ["<Translate  id='我是 id' text='我是文案' key='key' />", '我是文案', '我是 id'],

        // `
        ["<Translate id='我是 id' text={`我<var>案`} />", '我<var>案', '我是 id'],

        ["<Translate id='我是 id' text={`超长换\n行字符`} />", '超长换\n行字符', '我是 id'],
    ])('匹配 %s 中的 %s 和 %s', (content, text, id) => {
        const matchResult = matchTranslateRegex.exec(content);
        const groups = matchResult?.groups || {};
        let matchedText: string | undefined = undefined;
        let matchedId: string | undefined = undefined;
        for (const id in groups) {
            if (Object.prototype.hasOwnProperty.call(groups, id)) {
                if (id.startsWith('text') && groups[id]) {
                    matchedText = groups[id];
                }
                if (id.startsWith('id') && groups[id]) {
                    matchedId = groups[id];
                }
            }
        }
        expect(matchedText).toBe(text);
        expect(matchedId).toBe(id);
    });
});
