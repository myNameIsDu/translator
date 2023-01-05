module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [2, 'always', ['root', 'client', 'server', 'release']],
        'scope-empty': [2, 'never'],
    },
};
