module.exports = {
  // Use jsdom environment to simulate browser DOM
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/schemas.js', // Exclude schema file (just data)
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  
  // Coverage thresholds (adjusted for vanilla JS with DOM dependencies)
  coverageThreshold: {
    global: {
      branches: 14,
      functions: 60,
      lines: 35,
      statements: 36
    }
  },
  
  // Coverage output directory
  coverageDirectory: 'coverage',
  
  // Verbose output
  verbose: true,
  
  // Setup file to run before tests (if needed)
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
