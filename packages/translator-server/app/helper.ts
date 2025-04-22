import { completeJsonPath, workDirSrcPath } from './const';
import { type LocalesType, type RecordType } from '../../common/config';
import { simpleHolderFinder } from '../../common/utils';
import { getTCalledTextAndId } from './parser-t';
import fs from 'fs';
import { globSync } from '../glob.server';
import { splitText } from '../../common/split-text';
import { getHolderAndExtraFromAst } from '../../common/get-holder-and-extra';

export const matchTranslateRegex =
    /<Translate\s*((text=((?<q1>["'])|({`))(?<text1>(.|\n)*?)((\k<q1>)|(`})))|(id=(?<q2>["'])(?<id1>.*?)\k<q2>)|(key=(?<q3>["'])(.*?)\k<q3>))?\s*((text=((?<q4>["'])|({`))(?<text2>(.|\n)*?)((\k<q4>)|(`})))|(id=(?<q5>["'])(?<id2>.*?)\k<q5>)|(key=(?<q6>["'])(.*?)\k<q6>))?\s*?((text=((?<q7>["'])|({`))(?<text3>(.|\n)*?)((\k<q7>)|(`})))|(id=(?<q8>["'])(?<id3>.*?)\k<q8>)|(key=(?<q9>["'])(.*?)\k<q9>))?\s*?\/>/g;

// export const matchTRegex =
//   /\bt\(\s*(?<q1>["`'])(?<text>(?:[\s\S])*?)\k<q1>(,\s*\{(?:(?:\s*id\s*:\s*(?<q2>["'])(?<id>.*?)\k<q2>\s*,?\s*)|(?<a>\s*[a-zA-Z_]\w*\s*,?\s*))*\})?\s*\)/g;

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
    return globSync(workDirSrcPath + '/**/*.{js,jsx,ts,tsx}', {
        ignore: {
            ignored: p => /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(p.name),
            childrenIgnored: p =>
                p.isNamed('__tests__') ||
                p.isNamed('__test__') ||
                p.isNamed('test') ||
                p.isNamed('tests') ||
                p.isNamed('mock') ||
                p.isNamed('mocks') ||
                p.isNamed('@types') ||
                p.isNamed('locales'),
        },
    });
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

        const matchTResult = getTCalledTextAndId(content);
        matchTResult.forEach(({ text: matchedText, id: matchedId, replaceXml }) => {
            let holder = '';
            if (replaceXml) {
                holder = getHolderAndExtraFromAst(splitText(matchedText)).holder;
            } else {
                holder = simpleHolderFinder(matchedText).holder;
            }
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
