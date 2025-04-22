## Install

```shell
pnpm install translator-client
```

## API

### t

react 上下文中的翻译方法

```tsx
declare function t(s: string, { id }?: { id: string }): string;
```

支持动态文案，例如

```tsx
t(`共计<${var}>`)
```

其中动态的部分会被替换为 `holder1` 并作为 `id` 使用

如果确需 `<>` 字符，则可使用转义符，例如

```tsx
t(`文案/<文案/>`);
```

在渲染时转义符会被自动去除

#### xml

```tsx
t('共计<span>特殊</span><page>页', {
    span: children => (
        <span key="span" style={{ color: 'red' }}>
            {children}
        </span>
    ),
});
```

```tsx
// 支持闭合标签
t('前<input/>%', {
    input: () => {
        return <input key="input" />;
    },
});
```

```tsx
// 支持标签嵌套
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
});
```

当 xml 替换函数返回 字符串时，t 函数也会尽量返回字符串

```tsx
expect(
    t('共计<span>特殊</span><page>页', {
        span: c => `<span style='color:red'>${c}</span>`,
    }),
).toBe("共计<span style='color:red'>特殊</span>page页");
```

更多用例[请查看](./packages/translator-client/src/__test__/translate.test.tsx)

### Translate

react 上下文外 (常量声明) 的翻译组件

```tsx
declare function Translate({ text, id }: TranslatePropsType): JSX.Element;
```

### setLanguage

切换语言的方法

```tsx
type SupportLanguagesType = 'zh' | 'en';

declare const setLang: (lang: SupportLanguagesType) => void;
```

### setLocales

设置翻译包

```tsx
export declare const supportLanguages: readonly ['zh', 'en'];
export declare type SupportLanguagesType = typeof supportLanguages[number];
export declare type LocalesItemType = Record<SupportLanguagesType, string>;
export declare type LocalesType = Record<string, LocalesItemType>;

export declare const setLocales: (nextLocales: LocalesType) => void;
```

## 强绑定的文案和`t`

为了能收集到所有的文案，所以牺牲了写法的灵活性，强行绑定文案和 `t`

例如：

错误的写法

```tsx
function Page() {
    const text = isReal ? '文案1' : '文案2';
    return t(text);
}
```

正确写法

```tsx
function Page() {
    const text = isReal ? t('文案1') : t('文案2');
    return text;
}
```

## 开发

-   使用 `pnpm link` 到全局，然后在项目中 link 下来
-   运行 `pnpm run build:watch`
