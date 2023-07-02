export const matchSimpleHolderRegex = /((\/?)<)(.+?)((\/?)>)/g;

// 提取 < > 占位符中间的动态文案，并且替换为 holder
export const simpleHolderFinder = (msg: string) => {
    const extra: Record<string, string> = {};
    const message = msg.trim();
    let index = 1;
    const holder = message.replace(
        matchSimpleHolderRegex,
        (_: string, $1: string, $2: string, $3: string, $4: string, $5: string) => {
            // 只有左右转义符同时存在时才生效
            if ($2 && $5) {
                return _;
            }
            const key = `holder${index}`;
            index++;

            // 否做作为普通字符串处理
            // 只存在左转义符
            if ($2) {
                extra[key] = $3;
                return `${$2}<${key}>`;
            }
            // 只存在右转义符
            if ($5) {
                extra[key] = $3 + $5;
                return `<${key}>`;
            }
            // 左右转义符都不存在
            extra[key] = $3;
            return `<${key}>`;
        },
    );
    return {
        holder: holder,
        extra,
    };
};

// 替换词条中的 holder 为真实的文本，删除转义符
export const replaceHolderToRealText = (msg: string, extra: Record<string, string>) => {
    return msg.replace(
        matchSimpleHolderRegex,
        (_: string, $1: string, $2: string, $3: string, $4: string, $5: string) => {
            // 当左右转义符同时存在时，不作为占位符处理，并且删除转义符
            if ($2 && $5) {
                return `<${$3}>`;
            }
            // 替换为真实数据
            const realText = extra[$3];
            // 如果存在左转义符则当做正常文本
            return $2 ? $2 + realText : realText;
        },
    );
};
