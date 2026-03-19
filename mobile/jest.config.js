module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^react-native-vector-icons/(.*)$':
      '<rootDir>/__mocks__/react-native-vector-icons.js',
    '^react-native-encrypted-storage$':
      '<rootDir>/__mocks__/react-native-encrypted-storage.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(zustand|immer|@react-native|react-native|@react-navigation)/)',
  ],
};
