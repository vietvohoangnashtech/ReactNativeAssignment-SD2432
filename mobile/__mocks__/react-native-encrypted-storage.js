/** Manual mock for react-native-encrypted-storage */
const EncryptedStorage = {
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
};

module.exports = EncryptedStorage;
module.exports.default = EncryptedStorage;
