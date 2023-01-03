import type { ActionFunction } from "@remix-run/node";
import { readObjectComplete } from "../helper";
import { completeJsonPath } from "../const";
import fs from "fs";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const zh = formData.get("zh");
  const en = formData.get("en");
  const original = readObjectComplete();
  fs.writeFileSync(
    completeJsonPath,
    JSON.stringify(
      {
        ...original,
        [id]: { zh: zh, en: en },
      },
      null,
      2
    )
  );

  return new Response();
};
