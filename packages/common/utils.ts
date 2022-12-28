export const matchHolderRegex = /#\$%(.+?)#\$%/g;

export const holderFinder = (msg: string) => {
  const extra: Record<string, string> = {};
  const message = (msg + "" || "").trim();
  let index = 1;

  const holder = message.replace(matchHolderRegex, (_, $1) => {
    const key = `holder${index}`;
    extra[key] = $1;
    index++;
    return `#$%${key}#$%`;
  });
  return {
    holder: holder || message,
    extra,
  };
};
