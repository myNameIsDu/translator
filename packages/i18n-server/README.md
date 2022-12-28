## Install

```shell
pnpm i i18n-server -d

pnpm i18n
```

然后打开 `http://localhost:7733/`

## 约定

1. 执行 `i18n` 命令下的  `src/locales/complete.json` 为存放语言包的文件
2. 所有需要翻译的文案及使用当前工具的工作目录为`src`，即扫描收集文案会在 `src` 目录下进行

## 开发

1. 当前包 link 到全局

```shell
p -F "*-server"  link --global
```

2. 执行 `watch`

```
p -F "*-server"  dev-cli
```

3. 在需要有国家化需求的项目内执行

```shell
i18n
```
