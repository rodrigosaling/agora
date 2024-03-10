module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'plugin:react/recommended',
    'eslint:recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    // https://stackoverflow.com/a/56696478/785985
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: [
    'react-refresh',
    'react',
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'arrow-body-style': ['error', 'as-needed'],
    // https://stackoverflow.com/a/44939592/785985
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // https://stackoverflow.com/a/59268871/785985
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/302#issuecomment-425512505
    // 'jsx-a11y/label-has-associated-control': [
    //   'error',
    //   {
    //     required: {
    //       some: ['nesting', 'id'],
    //     },
    //   },
    // ],
    // 'jsx-a11y/label-has-for': [
    //   'error',
    //   {
    //     required: {
    //       some: ['nesting', 'id'],
    //     },
    //   },
    // ],
    // https://stackoverflow.com/a/68177043/785985
    // 'import/extensions': [
    //   'error',
    //   {
    //     js: 'ignorePackages',
    //   },
    // ],
  },
  root: true,
};
