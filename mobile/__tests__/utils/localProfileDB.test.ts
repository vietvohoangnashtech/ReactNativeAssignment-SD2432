import {localProfileDB, LocalProfile} from '../../src/utils/localProfileDB';

// Resolved via moduleNameMapper in jest.config.js
const AsyncStorage = require('@react-native-async-storage/async-storage');

const PROFILE_KEY = '@local_profile';

const mockProfile: LocalProfile = {
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('localProfileDB', () => {
  describe('save', () => {
    it('saves profile JSON with a savedAt timestamp', async () => {
      await localProfileDB.save(mockProfile);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      const [key, value] = AsyncStorage.setItem.mock.calls[0];
      expect(key).toBe(PROFILE_KEY);
      const saved = JSON.parse(value);
      expect(saved.username).toBe('testuser');
      expect(saved.savedAt).toBeDefined();
    });

    it('overwrites the previous entry', async () => {
      await localProfileDB.save(mockProfile);
      await localProfileDB.save({...mockProfile, firstName: 'Updated'});
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('does not throw when AsyncStorage fails', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Disk full'));
      await expect(
        localProfileDB.save(mockProfile),
      ).resolves.not.toThrow();
    });
  });

  describe('get', () => {
    it('returns null when nothing is stored', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const result = await localProfileDB.get();
      expect(result).toBeNull();
    });

    it('returns the parsed profile object', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify(mockProfile),
      );
      const result = await localProfileDB.get();
      expect(result).toMatchObject(mockProfile);
    });

    it('returns null and does not throw on AsyncStorage error', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(
        new Error('Storage error'),
      );
      const result = await localProfileDB.get();
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('calls removeItem with the profile key', async () => {
      await localProfileDB.clear();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(PROFILE_KEY);
    });

    it('does not throw when AsyncStorage fails', async () => {
      AsyncStorage.removeItem.mockRejectedValueOnce(new Error('Disk error'));
      await expect(localProfileDB.clear()).resolves.not.toThrow();
    });
  });
});
