import {useAuthStore} from '../../src/store/authStore';

// Mocks resolved via moduleNameMapper in jest.config.js
const EncryptedStorage = require('react-native-encrypted-storage');

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    exp: Math.floor(Date.now() / 1000) + 3600, // valid for 1 hour
    sub: '1',
  })),
}));

const {jwtDecode} = require('jwt-decode');

const resetStore = () =>
  useAuthStore.setState({
    isLoggedIn: false,
    token: null,
    loading: true,
    user: null,
  });

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe('authStore', () => {
  describe('login', () => {
    it('sets isLoggedIn and token in state', async () => {
      await useAuthStore.getState().login('tok-abc');
      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.token).toBe('tok-abc');
    });

    it('persists token to EncryptedStorage', async () => {
      await useAuthStore.getState().login('tok-abc');
      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        'tok-abc',
      );
    });

    it('saves user to state and storage when provided', async () => {
      const user = {id: 1, username: 'alice'};
      await useAuthStore.getState().login('tok-abc', user);
      expect(useAuthStore.getState().user).toMatchObject(user);
      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'auth_user',
        JSON.stringify(user),
      );
    });

    it('does not set user when none is provided', async () => {
      await useAuthStore.getState().login('tok-abc');
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears token, user, and isLoggedIn from state', async () => {
      await useAuthStore.getState().login('tok-abc', {username: 'alice'});
      await useAuthStore.getState().logout();
      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });

    it('removes both keys from EncryptedStorage', async () => {
      await useAuthStore.getState().logout();
      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('loadToken', () => {
    it('sets loading to false when no token is stored', async () => {
      EncryptedStorage.getItem.mockResolvedValue(null);
      await useAuthStore.getState().loadToken();
      const state = useAuthStore.getState();
      expect(state.loading).toBe(false);
      expect(state.isLoggedIn).toBe(false);
    });

    it('restores session for a valid non-expired token', async () => {
      EncryptedStorage.getItem.mockImplementation(key => {
        if (key === 'auth_token') {return Promise.resolve('valid-token');}
        if (key === 'auth_user') {
          return Promise.resolve(JSON.stringify({username: 'alice'}));
        }
        return Promise.resolve(null);
      });
      jwtDecode.mockReturnValue({exp: Math.floor(Date.now() / 1000) + 3600});

      await useAuthStore.getState().loadToken();
      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.token).toBe('valid-token');
      expect(state.user).toMatchObject({username: 'alice'});
      expect(state.loading).toBe(false);
    });

    it('clears expired token and stays logged out', async () => {
      EncryptedStorage.getItem.mockResolvedValue('expired-token');
      jwtDecode.mockReturnValue({exp: Math.floor(Date.now() / 1000) - 100});

      await useAuthStore.getState().loadToken();
      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('auth_user');
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it('clears storage and sets loading false on unexpected error', async () => {
      EncryptedStorage.getItem.mockRejectedValue(new Error('Storage exploded'));
      await useAuthStore.getState().loadToken();
      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(useAuthStore.getState().loading).toBe(false);
    });
  });

  describe('setUser', () => {
    it('updates user in state', () => {
      const user = {username: 'bob'};
      useAuthStore.getState().setUser(user);
      expect(useAuthStore.getState().user).toMatchObject(user);
    });

    it('persists new user data to EncryptedStorage', async () => {
      const user = {username: 'bob'};
      useAuthStore.getState().setUser(user);
      // setUser is fire-and-forget for storage
      await Promise.resolve();
      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
        'auth_user',
        JSON.stringify(user),
      );
    });
  });
});
