// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierRecommended,
      // NOTE: 커스텀 Config 구성 시 Next Config가 가장 마지막이어야 함
      // @see https://nextjs.org/docs/app/api-reference/config/eslint#additional-configurations
      next.flatConfig.recommended,
      next.flatConfig.coreWebVitals,
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    files: ['./**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules', 'dist', 'build', 'public', '.next'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike', // interface, type, class, enum 등
          format: ['PascalCase'],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'const', next: 'return' },
      ],
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error', // 문자열 연결 대신 템플릿 리터럴 사용
      'no-plusplus': 'error', // ++ 연산자 사용 금지
      'no-unneeded-ternary': 'error', // 불필요한 삼항 연산자 사용 금지
      'no-duplicate-imports': 'error', // 동일 모듈에서 임포트 여러 회 금지
    },
  },
  {
    files: ['**/*.stories.{ts,tsx}'],
    extends: [storybook.configs['flat/recommended']],
  },
);
