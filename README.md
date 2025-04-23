# 一个简单的国际化工具

## 特点

-   使用简单
-   默认中文 id，无需特意声明各种 id，中文就写在代码中，高可读性
-   支持一个中文多种英文翻译 (特定 id)
-   支持动态文案
-   支持 xml 解决多元素语义问题
-   自动收集，并找出过期的翻译(在业务的迭代中，文案已经删除，但是翻译还存在)，避免语言包越来越大
-   可视化操作

## Install

```shell
pnpm install translator-client
pnpm install translator-server -D
```

主要注意的是，由于 `translator-server` 内置依赖 `react`，所以在 `npm` 下可能导致版本冲突，建议使用 `pnpm`

## Get Start

1. 在入口文件，导入 `setLocales`，从 `src/locales/complete.json` 导入 语言包，并传入 `setLocales`

```tsx
import locales from './locales/complete.json';
import { setLocales } from 'translator-client';

setLocales(locales);
```

`src/locales/complete.json` 需要手动创建，并写入一个空对象

2. `t` 和 `Translate` 的使用

在需要翻译的文案外包一层 `t`,

```tsx
import { t } from 'translator-client';
function Page() {
    return t('文案');
}
```

在 `react`组件外的文案 (常量的声明里) 需要使用 `Translate`

```tsx
import { Translate } from 'translator-client';
export const data = [
    {
        label: <Translate text="文案1" />,
        value: '1',
    },
    {
        label: <Translate text="文案1" />,
        value: '2',
    },
];
```

3. 执行 `pnpm translator`，打开 `http://localhost:7733/` 可以查看到收集的文案，并操作

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

## Translate 组件和 t 函数的本质区别

区分 `Translate` 和 `t` 函数使用主要是目的是区分不同的执行时机，`t('')`会被直接调用，而 `Translate` 组件会被编译成一个函数，在渲染时调用。

原因是因为 `t` 函数的调用是直接调用，如果有以下导入结构和代码

```js
// constants.js
export const constant = [
    label: t('xxx'),
    value: 'xxx'
]
```

```js
// index.js
import { constant } from './constants.js';
import { setLocales } from 'translator-client';
import locales from '@/locales/complete.json';

setLocales(locales);
```

首先导入了 `constants.js` 所以在执行 `t('xxx')` 的时候 `setLocales(locales)` 还没有执行，因此 `t` 函数此时还没有拿到翻译相关数据。

当然，实际项目中会很复杂，可能出现直接在常量中使用 `t` 函数会生效的情况，例如你使用了懒加载，但是还是建议按照约定，明确区分 `t` 和 `Translate` 的使用场景，即在组件内和函数内使用 `t`, 在常量中使用 `Translate`。

## 开发和发布

### 开发

开发流程详见各个包的说明文档

### 发布

-   运行 `pnpm -F "*" build` 打包
-   开发完成后执行 `pnpm changeset`生成 changeset 文件

    -   选择所有包（本仓库的包全部使用统一版本，即 server 发了一个 patch 版本，即使 client 没有改动，也需要发布一个 patch 版本，用来避免不同版本的匹配问题）

    -   选择需要发布的版本 (major, minor 或者 patch)

    -   填写更改信息

    需要特别注意的是，生成的 changeset 需要和更改放在同一个 commit 内，即在还没有 commit 的时候完成这一步，或者 amend 进去 (执行 `pnpm changeset` 的时候会提示更改的文件，如果更改已经被 commit, 这个时候不会提示有更改无须担心)
