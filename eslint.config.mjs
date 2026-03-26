import globals from 'globals';
import eslintJs from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

// ----------------------------------------------------------------------

/**
 * @rules common
 */
const commonRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,
  'func-names': 1,
  'no-bitwise': 2,
  'no-unused-vars': [1, { args: 'none' }],
  'object-shorthand': 1,
  'no-useless-rename': 1,
  'default-case-last': 2,
  'no-constant-condition': 1,
  // react
  'react/jsx-key': 0,
  'react/prop-types': 0,
  'react/display-name': 0,
  'react/no-children-prop': 0,
  'react/jsx-boolean-value': 2,
  'react/self-closing-comp': 2,
  'react/react-in-jsx-scope': 0,
  'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
  'react/jsx-curly-brace-presence': [2, { props: 'never', children: 'never' }],
});

/**
 * Custom ESLint configuration.
 */
export const customConfig = {
  plugins: {
    'react-hooks': reactHooksPlugin,
  },
  rules: {
    ...commonRules(),
  },
};

// ----------------------------------------------------------------------

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { ignores: ['*', '!src/', '!eslint.config.*'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
  },
  eslintJs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  customConfig,
];
