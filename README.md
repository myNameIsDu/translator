## 一个简单的国际化工具

## 特点

- 使用简单
- 默认中文 id，无需特意声明各种 id，中文就写在代码中，所见以所得
- 支持一个中文多种英文翻译 (特定 id)
- 支持动态文案
- 自动收集，并找出过期的翻译(在业务的迭代中，文案已经删除，但是翻译还存在)，避免语言包越来越大
- 可视化操作

## Install

```shell
pnpm install translator-client
pnpm install translator-server -D
```

## Get Start

1. 导入 `Provider`，从 `src/locales/complete.json` 导入 语言包，并传入 `Provider`

```tsx
import locales from './locales/complete.json';
import { TranslatorProvider } from 'translator-client';

<TranslatorProvider locales={locales}>
</TranslatorProvider>

```

`src/locales/complete.json` 需要手动创建，并写入一个空对象

2. `t` 和 `Translate` 的使用

在需要翻译的文案外包一层 `t`,

```tsx
import { t } from 'translator-client';
function Page (){
    return t('文案')
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
declare function t(s: string, { id }?: {id: string}): string;
```

支持动态文案，例如

```tsx
t(`共计#$%${var}#$%`)
```

其中动态的部分会被替换为 `holder1` 并作为 `id` 使用

### Translate

react 上下文外 (常量声明) 的翻译组件

```tsx
declare function Translate({ text, id }: TranslatePropsType): JSX.Element;
```

### setLanguage

切换语言的方法

```tsx
type SupportLanguagesType = "zh" | "en"

declare const setLang: (lang: SupportLanguagesType) => void;
```

## 强绑定的文案和`t`

为了能收集到所有的文案，所以牺牲了写法的灵活性，强行绑定文案和 `t`

例如：

错误的写法

```tsx
function Page(){
  const text = isReal ? "文案1" : "文案2"
  return t(text)
}
```

正确写法

```tsx
function Page(){
  const text = isReal ? t("文案1") : t("文案2")
  return text
}
```
