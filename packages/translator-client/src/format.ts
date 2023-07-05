import { DistinguishedItemType } from '../../common/types';

type ReplaceXmlFuncType = (v: FormattedResult) => JSX.Element | string;

export type ReplaceXmlObjType = {
    [x: string]: ((v: FormattedResult) => JSX.Element | string) | string | undefined;
};

export type MultipleResult = (string | JSX.Element)[];
export type FormattedResult = JSX.Element | string | MultipleResult;
/**
 *
 * @param result
 * @returns
 * @description 将结果中的连续的 string 合并起来
 */
function combineString(result: MultipleResult) {
    return result.reduce((p, c) => {
        if (typeof c === 'string' && typeof p[p.length - 1] === 'string') {
            p[p.length - 1] += c;
        } else {
            p.push(c);
        }
        return p;
    }, [] as MultipleResult);
}

/**
 *
 * @param ast
 * @param replaceXml
 * @param offset
 * @returns (string | JSX.Element)[]
 * @description 将 ast 和 replaceXml 拼接最终 返回
 */
export function format(
    ast: DistinguishedItemType[],
    replaceXml: ReplaceXmlObjType,
    offset = 0,
): FormattedResult {
    const result: MultipleResult = [];
    for (let index = 0; index < ast.length; index++) {
        const element = ast[index];
        if (element.type === 'normal') {
            result.push(element.text);
        } else if (element.type === 'xml') {
            const coupleIndex = element.couple;
            const childrenAst = ast.slice(index + 1, coupleIndex - offset);
            const replaceXmlFunc = replaceXml[element.text]!;
            result.push(
                (replaceXmlFunc as ReplaceXmlFuncType)(format(childrenAst, replaceXml, index + 1)),
            );
            index = coupleIndex;
        } else {
            result.push(element.text);
        }
    }
    const combinedResult = combineString(result);
    if (combinedResult.length === 1) {
        return combinedResult[0];
    }
    return combinedResult;
}