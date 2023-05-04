---
'translator-client': patch
'translator-server': patch
---

fix:

1. 删除 dependencise @types/react 和 @types/react-dom
2. 修复文案中有换行时无法匹配，页面不支持展示和编辑换行 

pref:
3. 打包产物不压缩
