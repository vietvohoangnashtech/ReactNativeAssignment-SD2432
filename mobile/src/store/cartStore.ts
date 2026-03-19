import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create(
  immer<CartState>((set, get) => ({
    items: [],
    addItem: product => {
      set(state => {
        const existing = state.items.find(i => i.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
      });
    },
    removeItem: id => {
      set(state => {
        state.items = state.items.filter(i => i.id !== id);
      });
    },
    updateQuantity: (id, quantity) => {
      set(state => {
        const item = state.items.find(i => i.id === id);
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter(i => i.id !== id);
          } else {
            item.quantity = quantity;
          }
        }
      });
    },
    clearCart: () => {
      set(state => {
        state.items = [];
      });
    },
    totalAmount: () => {
      return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    totalItems: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },
  })),
);
