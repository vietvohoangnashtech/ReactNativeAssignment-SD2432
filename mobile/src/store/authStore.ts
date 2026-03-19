import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import EncryptedStorage from 'react-native-encrypted-storage';
import {jwtDecode} from 'jwt-decode';

export interface UserInfo {
  id?: number;
  username: string;
  fullName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  role?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  loading: boolean;
  user: UserInfo | null;
  login: (token: string, user?: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  setUser: (user: UserInfo) => void;
}

export const useAuthStore = create(
  immer<AuthState>(set => ({
    isLoggedIn: false,
    token: null,
    loading: true,
    user: null,
    login: async (token, user) => {
      try {
        await EncryptedStorage.setItem('auth_token', token);
        if (user) {
          await EncryptedStorage.setItem('auth_user', JSON.stringify(user));
        }
        set(state => {
          state.token = token;
          state.isLoggedIn = true;
          if (user) {
            state.user = user;
          }
        });
      } catch (error) {
        console.log('Error login', error);
      }
    },
    logout: async () => {
      try {
        await EncryptedStorage.removeItem('auth_token');
        await EncryptedStorage.removeItem('auth_user');
        set(state => {
          state.token = null;
          state.isLoggedIn = false;
          state.user = null;
        });
      } catch (error) {
        console.log('Error logout', error);
      }
    },
    loadToken: async () => {
      try {
        const storedToken = await EncryptedStorage.getItem('auth_token');
        if (storedToken) {
          const decodeToken = jwtDecode(storedToken);
          const isExpired = decodeToken.exp
            ? Date.now() >= decodeToken.exp * 1000
            : true;
          if (isExpired) {
            await EncryptedStorage.removeItem('auth_token');
            await EncryptedStorage.removeItem('auth_user');
          } else {
            const storedUser = await EncryptedStorage.getItem('auth_user');
            set(state => {
              state.token = storedToken;
              state.isLoggedIn = true;
              if (storedUser) {
                state.user = JSON.parse(storedUser);
              }
            });
          }
        }
      } catch (error) {
        console.log('error load token', error);
        await EncryptedStorage.removeItem('auth_token');
        await EncryptedStorage.removeItem('auth_user');
      } finally {
        set(state => {
          state.loading = false;
        });
      }
    },
    setUser: (user: UserInfo) => {
      set(state => {
        state.user = user;
      });
      EncryptedStorage.setItem('auth_user', JSON.stringify(user)).catch(() => {});
    },
  })),
);
