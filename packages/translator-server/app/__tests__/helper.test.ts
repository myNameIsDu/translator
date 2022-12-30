import { matchTranslateRegex, matchTRegex } from "../helper";

describe("正则匹配文件中的 文案 和 key", () => {
  afterEach(() => {
    matchTranslateRegex.lastIndex = 0;
    matchTRegex.lastIndex = 0;
  });
  it.each([
    // "
    ['<Translate text="我是文案" />', "我是文案", undefined],
    ['<Translate text="我是文案" key="我是 key"/>', "我是文案", "我是 key"],
    ['<Translate key="我是 key" text="我是文案" />', "我是文案", "我是 key"],

    // '
    ["<Translate text='我是文案' />", "我是文案", undefined],
    ["<Translate text='我是文案' key='我是 key'/>", "我是文案", "我是 key"],
    ["<Translate key='我是 key' text='我是文案' />", "我是文案", "我是 key"],

    [
      "<Translate key='我是 key' text={`我#$%var#$%案`} />",
      "我#$%var#$%案",
      "我是 key",
    ],
  ])("匹配 %s 中的 %s 和 %s", (content, text, key) => {
    const matchResult = matchTranslateRegex.exec(content);
    const groups = matchResult?.groups || {};
    let matchedText: string | undefined = undefined;
    let matchedKey: string | undefined = undefined;
    for (const key in groups) {
      if (Object.prototype.hasOwnProperty.call(groups, key)) {
        if (key.startsWith("text") && groups[key]) {
          matchedText = groups[key];
        }
        if (key.startsWith("key") && groups[key]) {
          matchedKey = groups[key];
        }
      }
    }
    expect(matchedText).toBe(text);
    expect(matchedKey).toBe(key);
  });

  it.each([
    // "
    ['t("我是文案")', "我是文案", undefined],
    ['t("我是文案",{key:"我是 key"})', "我是文案", "我是 key"],
    ['t("我是文案", { key : "我是 key" })', "我是文案", "我是 key"],

    // '
    ["t('我是文案')", "我是文案", undefined],
    ["t('我是文案',{key:'我是 key'})", "我是文案", "我是 key"],
    ["t('我是文案', { key : '我是 key' })", "我是文案", "我是 key"],

    // `
    ["t(`我#$%var#$%案`)", "我#$%var#$%案", undefined],
  ])("匹配 %s 中的 %s 和 %s", (content, text, key) => {
    const matchResult = matchTRegex.exec(content);
    const groups = matchResult?.groups || {};
    const matchedText: string | undefined = groups.text;
    const matchedKey: string | undefined = groups.key;

    expect(matchedText).toBe(text);
    expect(matchedKey).toBe(key);
  });
});
