
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.base.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'void-ui'],
  rules: {
    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',

    // TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // ─── void-ui Code Conventions ────────────────────────────────────────────

    // No !! double-negation — use Boolean() instead
    'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],

    // All if/else/for/while bodies must use braces — no single-line ifs
    'curly': ['error', 'all'],

    // Block body must not be on a single line — if (!x) { return } is invalid
    'void-ui/no-single-line-block': 'error',

    // Blank line between statements — applies to declarations and expressions
    // Does NOT apply to imports (excluded by default)
    'padding-line-between-statements': [
      'error',
      // blank line BEFORE return
      { blankLine: 'always', prev: '*', next: 'return' },
      // blank line AFTER const/let/var blocks
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any',    prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      // blank line BEFORE if
      { blankLine: 'always', prev: '*', next: 'if' },
      // blank line AFTER if
      { blankLine: 'always', prev: 'if', next: '*' },
      // blank line BEFORE function declarations
      { blankLine: 'always', prev: '*', next: 'function' },
      // blank line between consecutive expressions (e.g. render(), await calls in tests)
      { blankLine: 'always', prev: 'expression', next: 'expression' },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'node_modules', 'storybook-static', '*.cjs'],
}
