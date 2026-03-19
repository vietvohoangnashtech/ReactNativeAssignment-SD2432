import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import EncryptedStorage from 'react-native-encrypted-storage';
import {jwtDecode} from 'jwt-decode';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create(
  immer<AuthState>(set => ({
    isLoggedIn: false,
    token: null,
    loading: true,
    login: async token => {
      try {
        await EncryptedStorage.setItem('auth_token', token);
        set(state => {
          state.token = token;
          state.isLoggedIn = true;
        });
      } catch (error) {
        console.log('Error login', error);
      }
    },
    logout: async () => {
      try {
        await EncryptedStorage.removeItem('auth_token');
        set(state => {
          state.token = null;
          state.isLoggedIn = false;
        });
      } catch (error) {
        console.log('Error logout', error);
      }
    },
    loadToken: async () => {
      try {
        const storedToken = await EncryptedStorage.getItem('auth_token');
        if (storedToken) {
          // check if token is expired
          const decodeToken = jwtDecode(storedToken);
          const isExpired = decodeToken.exp
            ? Date.now() >= decodeToken.exp * 1000
            : true;
          if (isExpired) {
            await EncryptedStorage.removeItem('auth_token');
          } else {
            set(state => {
              state.token = storedToken;
              state.isLoggedIn = true;
            });
          }
        }
      } catch (error) {
        console.log('error load token', error);
        await EncryptedStorage.removeItem('auth_token');
      } finally {
        set(state => {
          state.loading = false;
        });
      }
    },
  })),
);
