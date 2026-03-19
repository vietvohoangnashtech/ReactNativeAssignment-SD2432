/**
 * Local profile database using AsyncStorage.
 * Fulfills assignment task 5: Save user profile to local database.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@local_profile';

export interface LocalProfile {
  id?: number;
  username: string;
  fullName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  savedAt?: string;
}

export const localProfileDB = {
  save: async (profile: LocalProfile): Promise<void> => {
    try {
      const data = { ...profile, savedAt: new Date().toISOString() };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving profile locally:', error);
    }
  },

  get: async (): Promise<LocalProfile | null> => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        return JSON.parse(raw) as LocalProfile;
      }
      return null;
    } catch (error) {
      console.warn('Error reading local profile:', error);
      return null;
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
    } catch (error) {
      console.warn('Error clearing local profile:', error);
    }
  },
};
