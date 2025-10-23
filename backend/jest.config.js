module.exports = {
  // Use Node environment for Express / Mongoose apps
  testEnvironment: 'node',

  // Match test files inside tests folder or any file ending in .test.js / .spec.js
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).[jt]s'
  ],

  // Collect coverage only from relevant source files
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // Where Jest should output coverage reports
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Run setup before tests (for DB connections, mocks, etc.)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Increase test timeout (useful for async DB tests)
  testTimeout: 10000,
};