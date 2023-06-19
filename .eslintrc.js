module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    extends: [
        'plugin:vue/recommended',
        'eslint:recommended',
        'prettier',
        'plugin:storybook/recommended',
        'plugin:storybook/recommended',
    ],
    rules: {
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'no-console': 'off',
        'no-debugger': 'off',
        'vue/no-child-content': 'off',
        'no-undef': 'off',
        'vue/no-v-text-v-html-on-component': 'off',
        'vue/no-v-html': 'off',
        semi: [2, 'never'],
        'vue/max-attributes-per-line': 'off',
        'prettier/prettier': [
            'error',
            {
                semi: false,
            },
        ],
        'vue/require-default-prop': 'off',
        'vue/require-valid-default-prop': 'off',
    },
    plugins: ['vue', 'prettier'],
    globals: {
        $nuxt: true,
    },
}
