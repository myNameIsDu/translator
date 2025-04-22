/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node'],
    root: true,
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
    },
};
