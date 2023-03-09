---
'translator-client': minor
'translator-server': minor
---

feature: 支持简单的占位符 <>, 删除旧的 #$% 占位符, 如需要展示 <> 则可使用 转义符 t("文案/<文案/>")

fix: 翻译文件导入后未删除

perf: 删除找不到词条时的 log
