# translator-server

## 0.4.0

### Minor Changes

-   e2dad86: 同步最新修改

## 0.3.0

### Minor Changes

-   21a14ab: t 函数增加支持 xml 解决 多元素 语序问题

## 0.2.2

### Patch Changes

-   950864a: fix:

    1. 删除 dependencise @types/react 和 @types/react-dom
    2. 修复文案中有换行时无法匹配，页面不支持展示和编辑换行

    pref: 3. 打包产物不压缩

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

-   17a8157: 锁定 remix 版本,修复安装包时隐形升级导致的 remix 版本错误

## 0.1.2

### Patch Changes

-   3af0de5: 修复下载安装包时隐形依赖升级导致的 remix 版本错误

## 0.1.1

### Patch Changes

-   8a4af6d: setLang 时更新当前 lang, 搜索文案时取消 edit

## 0.1.0

### Minor Changes

-   ebb74d1: 词条 key 的换为 id, Translate 支持 react 的关键词 key,

## 0.0.3

### Patch Changes

-   ca5c1e1: zh-CH en-US => zh en,Translate 组件支持动态文案

## 0.0.2

### Patch Changes

-   13a08ff: 修复 build 未使用 remix build

## 0.0.1

### Patch Changes

-   521356f: 添加 publish 和 test actions
