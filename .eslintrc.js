module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                'no-undef': 'off'
            }
        }
    ],
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'eslint:recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            { "argsIgnorePattern": "^_" }
        ],

        "prettier/prettier": [
            "error",
            {
                "extends": ["next", "prettier"],
                "bracketSpacing": true,
                "printWidth": 80,
                "tabWidth": 4,
                "useTabs": false,
                "endOfLine": "auto",
                "arrowParens": "always",
                "semi": true,
                "singleQuote": true,
                "trailingComma": "none"
            }
        ]
    },
};
