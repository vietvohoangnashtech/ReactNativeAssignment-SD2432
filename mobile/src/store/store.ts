import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        // Useful for handling non-serializable data in action payloads
        ignoredActions: ['auth/loadToken/fulfilled', 'auth/login/fulfilled'],
        ignoredPaths: [],
      },
    }).concat([]),
  devTools: __DEV__, // Enable Redux DevTools in development
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
