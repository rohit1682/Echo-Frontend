/**
 * Jest configuration for the Expo app.
 * Uses the `jest-expo` preset so React Native / Expo modules transform correctly.
 *
 * A 100% coverage gate (see the pre-commit hook) is enforced over the app's pure,
 * unit-testable LOGIC — formatting helpers, the typed API layer, and the auth/session
 * store. Presentational React Native components, animation code, thin native-module
 * wrappers (haptics/storage/logger), React Query hook wiring, and route/screen files
 * are validated via type-checking and end-to-end runs rather than unit tests, so they
 * are excluded from coverage collection. Widen `collectCoverageFrom` as component/
 * integration tests are added.
 */
module.exports = {
  preset: 'jest-expo',
  collectCoverageFrom: ['src/utils/format.ts', 'src/api/echo.ts', 'src/store/auth.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
