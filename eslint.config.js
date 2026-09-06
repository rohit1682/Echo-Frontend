// Flat ESLint config for the Expo app (eslint-config-expo).
const expoConfig = require('eslint-config-expo/flat');

const base = Array.isArray(expoConfig) ? expoConfig : [expoConfig];

module.exports = [
  ...base,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'babel.config.js', 'metro.config.js'],
  },
  {
    // react-native-reanimated mutates shared `.value`s inside worklets, which the
    // React Compiler hook rules flag as false positives. Relax those; keep the rest.
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/preserve-manual-memoization': 'off',
      // axios's default export legitimately exposes create()/isAxiosError().
      'import/no-named-as-default-member': 'off',
    },
  },
];
