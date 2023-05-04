import { completeJsonPath, workDirSrcPath } from './const';
import { type LocalesType, type RecordType } from '../../common/config';
import { simpleHolderFinder } from '../../common/utils';
import fs from 'fs';
import glob from '../glob.server';

export const matchTranslateRegex =
    /<Translate\s*((text=((?<q1>["'])|({`))(?<text1>(.|\n)*?)((\k<q1>)|(`})))|(id=(?<q2>["'])(?<id1>.*?)\k<q2>)|(key=(?<q3>["'])(.*?)\k<q3>))?\s*((text=((?<q4>["'])|({`))(?<text2>(.|\n)*?)((\k<q4>)|(`})))|(id=(?<q5>["'])(?<id2>.*?)\k<q5>)|(key=(?<q6>["'])(.*?)\k<q6>))?\s*?((text=((?<q7>["'])|({`))(?<text3>(.|\n)*?)((\k<q7>)|(`})))|(id=(?<q8>["'])(?<id3>.*?)\k<q8>)|(key=(?<q9>["'])(.*?)\k<q9>))?\s*?\/>/g;

export const matchTRegex =
    /\bt\(\s*(?<q1>["`'])(?<text>(.|\n)*?)\k<q1>(,\s*\{\s*id\s*:\s*(?<q2>["'])(?<id>.*?)\k<q2>\s*\})?\s*\)/g;

export function readObjectComplete(): LocalesType {
    return JSON.parse(fs.readFileSync(completeJsonPath, 'utf-8'));
}
export function readArrayComplete() {
    const original: LocalesType = JSON.parse(fs.readFileSync(completeJsonPath, 'utf-8'));
    return Object.keys(original).map(key => ({
        id: key,
        ...original[key],
    }));
}

export function readAllFiles() {
    return glob.sync(workDirSrcPath + '/**/*.{js,jsx,ts,tsx}');
}

export function getAllTextAndId() {
    const fileList = readAllFiles();
    const allIds: string[] = [];
    const allRecord: RecordType = [];
    fileList.forEach(v => {
        const content = fs.readFileSync(v, 'utf-8');
        const matchTranslateResult = [...content.matchAll(matchTranslateRegex)];
        matchTranslateResult.forEach(({ groups = {} }) => {
            let matchedText: string | undefined = undefined;
            let matchedId: string | undefined = undefined;
            for (const id in groups) {
                if (Object.prototype.hasOwnProperty.call(groups, id)) {
                    if (id.startsWith('text') && groups[id]) {
                        matchedText = groups[id];
                    }
                    if (id.startsWith('id') && groups[id]) {
                        matchedId = groups[id];
                    }
                }
            }
            const holder = simpleHolderFinder(matchedText!).holder;
            let realId = matchedId || holder;
            if (!allIds.includes(realId)) {
                allIds.push(realId);
                allRecord.push({ id: realId, zh: holder });
            }
        });

        const matchTResult = [...content.matchAll(matchTRegex)];
        matchTResult.forEach(({ groups = {} }) => {
            const matchedText: string | undefined = groups.text;
            const matchedId: string | undefined = groups.id;
            const holder = simpleHolderFinder(matchedText!).holder;
            let realId = matchedId || holder;
            if (!allIds.includes(realId)) {
                allIds.push(realId);
                allRecord.push({ id: realId, zh: holder });
            }
        });
    });
    return { allIds, allRecord };
}

export function getUnTranslate() {
    const { allRecord } = getAllTextAndId();
    const translatedObject = readObjectComplete();
    const translatedIds = Object.keys(translatedObject);
    return allRecord.filter(v => !translatedIds.includes(v.id));
}
