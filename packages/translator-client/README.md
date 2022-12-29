## Install

```shell
pnpm install translator-client
```

## API

### t

react 上下文中的翻译方法

```tsx
declare function t(s: string, { key }?: {key: string}): string;
```

支持动态文案，例如

```tsx
t(`共计#$%${var}#$%`)
```

其中动态的部分会被替换为 `holder1` 并作为 `key` 使用

### Translate

react 上下文外 (常量声明) 的翻译组件

```tsx
declare function Translate({ text, key }: TranslatePropsType): JSX.Element;
```

### setLanguage

切换语言的方法，切换后会自动 reload 页面

```tsx
type SupportLanguagesType = "zh-CN" | "en-US"

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
