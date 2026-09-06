/**
 * Jest configuration for the Expo app.
 * Uses the `jest-expo` preset so React Native / Expo modules transform correctly.
 * A 100% coverage gate is enforced (see the pre-commit hook). Screen/route files
 * under src/app are excluded from coverage collection — they are exercised via
 * end-to-end/device testing rather than unit tests.
 */
module.exports = {
  preset: 'jest-expo',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
