# translator-client

## 0.2.1

### Patch Changes

-   219efef: 修复 在 t(\n xxxx \n) 的情况下正则不匹配, 无法提取文案

## 0.2.0

### Minor Changes

-   0732e2d: feature: 支持简单的占位符 <>, 删除旧的 #$% 占位符, 如需要展示 <> 则可使用 转义符 t("文案/<文案/>")

    fix: 翻译文件导入后未删除

    perf: 删除找不到词条时的 log

## 0.1.3

### Patch Changes

-   9263efa: 修复 setLang 未更改当前 lang

## 0.1.2

### Patch Changes

-   8a4af6d: setLang 时更新当前 lang, 搜索文案时取消 edit

## 0.1.1

### Patch Changes

-   0e844cc: setLang 不 reload 页面

## 0.1.0

### Minor Changes

-   ebb74d1: 词条 key 的换为 id, Translate 支持 react 的关键词 key,

## 0.0.5

### Patch Changes

-   ca5c1e1: zh-CH en-US => zh en,Translate 组件支持动态文案

## 0.0.4

### Patch Changes

-   521356f: 添加 publish 和 test actions
