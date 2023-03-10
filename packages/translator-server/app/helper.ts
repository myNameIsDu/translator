import { completeJsonPath, workDirSrcPath } from './const';
import { type LocalesType, type RecordType } from '../../common/config';
import { simpleHolderFinder } from '../../common/utils';
import fs from 'fs';
import glob from '../glob.server';

export const matchTranslateRegex =
    /<Translate( |\n|\t)*((text=((?<q1>["'])|({`))(?<text1>.*?)((\k<q1>)|(`})))|(id=(?<q2>["'])(?<id1>.*?)\k<q2>)|(key=(?<q3>["'])(.*?)\k<q3>))?( |\n|\t)*((text=((?<q4>["'])|({`))(?<text2>.*?)((\k<q4>)|(`})))|(id=(?<q5>["'])(?<id2>.*?)\k<q5>)|(key=(?<q6>["'])(.*?)\k<q6>))?( |\n|\t)*?((text=((?<q7>["'])|({`))(?<text3>.*?)((\k<q7>)|(`})))|(id=(?<q8>["'])(?<id3>.*?)\k<q8>)|(key=(?<q9>["'])(.*?)\k<q9>))?( |\n|\t)*?\/>/g;

export const matchTRegex =
    /\bt\((?<q1>["`'])(?<text>.*?)\k<q1>(,( |\n|\t)*\{( |\n|\t)*id( |\n|\t)*:( |\n|\t)*(?<q2>["'])(?<id>.*?)\k<q2>( |\n|\t)*\})?\)/g;

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
