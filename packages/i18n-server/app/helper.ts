import { completeJsonPath, workDirSrcPath } from "./const";
import { type LocalesType, type RecordType } from "../../common/config";
import { holderFinder } from "../../common/utils";
import fs from "fs";
import glob from "../glob.server";

export const matchTranslateRegex =
  /<Translate( |\n|\t)*((text=(?<q1>["'])(?<text1>.*?)\k<q1>)|(key=(?<q2>["'])(?<key1>.*?)\k<q2>))?( |\n|\t)*((text=(?<q3>["'])(?<text2>.*?)\k<q3>)|(key=(?<q4>["'])(?<key2>.*?)\k<q4>))?( |\n|\t)*?\/>/g;

export const matchTRegex =
  /\bt\((?<q1>["`'])(?<text>.*?)\k<q1>(,( |\n|\t)*\{( |\n|\t)*key( |\n|\t)*:( |\n|\t)*(?<q2>["'])(?<key>.*?)\k<q2>( |\n|\t)*\})?\)/g;

export function readObjectComplete(): LocalesType {
  return JSON.parse(fs.readFileSync(completeJsonPath, "utf-8"));
}
export function readArrayComplete() {
  const original: LocalesType = JSON.parse(
    fs.readFileSync(completeJsonPath, "utf-8")
  );
  return Object.keys(original).map((key) => ({
    key,
    ...original[key],
  }));
}

export function readAllFiles() {
  return glob.sync(workDirSrcPath + "/**/*.{js,jsx,ts,tsx}");
}

export function getAllTextAndKey() {
  const fileList = readAllFiles();
  const allKeys: string[] = [];
  const allRecord: RecordType = [];
  fileList.forEach((v) => {
    const content = fs.readFileSync(v, "utf-8");
    const matchTranslateResult = [...content.matchAll(matchTranslateRegex)];
    matchTranslateResult.forEach(({ groups = {} }) => {
      let matchedText: string | undefined = undefined;
      let matchedKey: string | undefined = undefined;
      for (const key in groups) {
        if (Object.prototype.hasOwnProperty.call(groups, key)) {
          if (key.startsWith("text") && groups[key]) {
            matchedText = groups[key];
          }
          if (key.startsWith("key") && groups[key]) {
            matchedKey = groups[key];
          }
        }
      }
      const holder = holderFinder(matchedText!).holder;
      let realKey = matchedKey || holder;
      if (!allKeys.includes(realKey)) {
        allKeys.push(realKey);
        allRecord.push({ key: realKey, "zh-CN": holder });
      }
    });

    const matchTResult = [...content.matchAll(matchTRegex)];
    matchTResult.forEach(({ groups = {} }) => {
      const matchedText: string | undefined = groups.text;
      const matchedKey: string | undefined = groups.key;
      const holder = holderFinder(matchedText!).holder;
      let realKey = matchedKey || holder;
      if (!allKeys.includes(realKey)) {
        allKeys.push(realKey);
        allRecord.push({ key: realKey, "zh-CN": holder });
      }
    });
  });
  return { allKeys, allRecord };
}

export function getUnTranslate() {
  const { allRecord } = getAllTextAndKey();
  const translatedObject = readObjectComplete();
  const translatedKeys = Object.keys(translatedObject);
  return allRecord.filter((v) => !translatedKeys.includes(v.key));
}
