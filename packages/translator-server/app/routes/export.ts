import type { LoaderFunction } from "@remix-run/node";
import xlsx from "node-xlsx";
import { getUnTranslate } from "../helper";

export const loader: LoaderFunction = () => {
  const data = getUnTranslate();
  const xlsxArray = [
    ["其中：共计#$%holder1#$%条，holer1 为占位符，是动态填充的内容"],
    [
      "key(当前词条唯一标识，默认为中文，如有同一中文多种英文翻译的情况可做备用)",
      "中文",
      "英文",
    ],
  ];
  const resetData = data.map((v) => [v.key, v["zh-CN"]]);
  const buffer = xlsx.build([
    {
      name: "未翻译词条",
      data: [...xlsxArray, ...resetData],
      options: {
        "!cols": [{ wpx: 500 }, { wpx: 500 }],
        "!merges": [{ s: { r: 0, c: 1 }, e: { r: 0, c: 0 } }],
      },
    },
  ]);
  return new Response(buffer, {
    headers: {
      "Content-type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=unTranslate.xlsx",
    },
  });
};
