/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  preset: 'react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.ts',
  },
  clearMocks: true,
  setupFiles: ['./jest-setup.js'],
};
