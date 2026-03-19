import {useCartStore} from '../../src/store/cartStore';

const PRODUCT_A = {id: 1, name: 'Widget A', price: 10};
const PRODUCT_B = {id: 2, name: 'Widget B', price: 25};

beforeEach(() => {
  useCartStore.setState({items: []});
});

describe('cartStore', () => {
  describe('addItem', () => {
    it('adds a new item with quantity 1', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      const {items} = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({...PRODUCT_A, quantity: 1});
    });

    it('increments quantity when the same item is added again', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().addItem(PRODUCT_A);
      const {items} = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it('adds multiple distinct items independently', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().addItem(PRODUCT_B);
      expect(useCartStore.getState().items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes an existing item by id', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().removeItem(1);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('does not affect cart when id is not found', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().removeItem(99);
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity for an existing item', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().updateQuantity(1, 5);
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().updateQuantity(1, 0);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('removes the item when quantity is negative', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().updateQuantity(1, -1);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('does nothing when item id is not found', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().updateQuantity(99, 3);
      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('removes all items', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().addItem(PRODUCT_B);
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('is idempotent on an empty cart', () => {
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('totalAmount', () => {
    it('returns 0 for an empty cart', () => {
      expect(useCartStore.getState().totalAmount()).toBe(0);
    });

    it('calculates total across all items and quantities', () => {
      useCartStore.getState().addItem(PRODUCT_A); // 10 x1
      useCartStore.getState().addItem(PRODUCT_B); // 25 x1
      useCartStore.getState().updateQuantity(1, 3); // 10 x3 = 30
      // 30 + 25 = 55
      expect(useCartStore.getState().totalAmount()).toBe(55);
    });
  });

  describe('totalItems', () => {
    it('returns 0 for an empty cart', () => {
      expect(useCartStore.getState().totalItems()).toBe(0);
    });

    it('counts total quantity across all items', () => {
      useCartStore.getState().addItem(PRODUCT_A);
      useCartStore.getState().addItem(PRODUCT_B);
      useCartStore.getState().updateQuantity(1, 3); // 3 + 1 = 4
      expect(useCartStore.getState().totalItems()).toBe(4);
    });
  });
});
