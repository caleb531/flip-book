export default {
  testEnvironment: 'jsdom',
  preset: 'rollup-jest',
  setupFilesAfterEnv: ['<rootDir>/test/setup-jest.js'],
  // Display coverage summary below file-by-file coverage breakdown
  coverageReporters: ['clover', 'json', 'lcov', 'html', 'text', 'text-summary']
};
