import { RootState } from './rootReducer';
import { CartItem } from './slices/cartSlice';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthRefreshing = (state: RootState) => state.auth.refreshing;

// Cart selectors
export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalAmount = (state: RootState): number => {
  return state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const selectCartTotalItems = (state: RootState): number => {
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

export const selectCartItemCount = (state: RootState): number => {
  return state.cart.items.length;
};

export const selectCartItemById = (id: number) => (state: RootState): CartItem | undefined => {
  return state.cart.items.find((item) => item.id === id);
};

export const selectCartError = (state: RootState) => state.cart.error;
