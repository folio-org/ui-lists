const path = require('path');

const esModules = ['@folio', 'ky'].join('|');

module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  collectCoverageFrom: [
    '**/(lib|src)/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/test/jest/**',
  ],
  coverageThreshold: {
    global: {
      lines: 81
    },
  },
  coverageDirectory: './artifacts/coverage-jest/',
  coverageReporters: ['lcov'],
  reporters: ['jest-junit', 'default'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^.+\\.(css|svg)$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/(lib|src)/**/?(*.)test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/test/bigtest/', '/test/ui-testing/'],
  setupFiles: [
    path.join(__dirname, './test/jest/setupTests.ts'),
    'jest-canvas-mock'
  ],
  setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.ts')],
};
