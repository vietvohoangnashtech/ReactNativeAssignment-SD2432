export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  isOnSale?: boolean;
}

export interface ProfileData {
  id?: number;
  username: string;
  fullName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  role?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: string;
  paymentMethod?: string;
  status: string;
  createdAt: string;
}
