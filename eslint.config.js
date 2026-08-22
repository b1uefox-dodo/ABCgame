import tsPlugin from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...tsPlugin.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'vite.config.ts.timestamp-*']
  }
];
