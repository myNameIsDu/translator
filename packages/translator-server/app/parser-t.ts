import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

type MatchedResultType = {
    text: string;
    id?: string;
    replaceXml?: boolean;
};
export const getTCalledTextAndId = (code: string): MatchedResultType[] => {
    const ast = parser.parse(code, {
        sourceType: 'unambiguous',
        plugins: ['jsx', 'typescript'],
    });
    const matched: MatchedResultType[] = [];
    traverse(ast, {
        CallExpression: path => {
            const callee = path.node.callee;
            const args = path.node.arguments;
            let matchedEntry: MatchedResultType | null = null;
            if (callee.name === 't' && callee.type === 'Identifier') {
                const firstArg = args[0];
                const secondArg = args[1];
                if (firstArg.type === 'StringLiteral') {
                    matchedEntry = {
                        text: firstArg.value,
                    };
                }
                if (firstArg.type === 'TemplateLiteral') {
                    const originCode = generate(firstArg).code;
                    const originContent = originCode.slice(1, originCode.length - 1);
                    matchedEntry = {
                        text: originContent,
                    };
                }
                if (secondArg && secondArg.type === 'ObjectExpression') {
                    const properties = secondArg.properties;
                    properties.forEach(element => {
                        if (
                            element.type === 'ObjectProperty' &&
                            element.key?.type === 'Identifier' &&
                            element.key?.name === 'id' &&
                            element.value?.type === 'StringLiteral'
                        ) {
                            matchedEntry && (matchedEntry.id = element.value?.value);
                        }
                        if (
                            (element.type === 'ObjectProperty' &&
                                (element.value?.type === 'ArrowFunctionExpression' ||
                                    element.value?.type === 'FunctionExpression')) ||
                            element.type === 'ObjectMethod'
                        ) {
                            matchedEntry && (matchedEntry.replaceXml = true);
                        }
                    });
                }
            }
            matchedEntry && matched.push(matchedEntry);
        },
    });
    return matched;
};
