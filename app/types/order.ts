export interface BStore {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  images: string[];
  website?: string | null;
  geoLocation?: string | null;
  userId: string;
  bCategoryId: string;
  createdAt: string;
  updatedAt: string;
}
export interface StoreItem {
  id: string;
  bStoreId: string;
  images: string[];
  name: string;
  description: string;
  cost: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  cartId?: string | null;
}
export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  priceAtOrder: number;
  item: StoreItem;
}
export interface OrderModel {
  id: string;
  orderId: string;
  userId: string;
  bStoreId: string;
  totalCost: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  orderNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  bStore: BStore;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
