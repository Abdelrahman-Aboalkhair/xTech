export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  products: CartItem[];
}

export interface CartLookupParams {
  userId?: string;
  cartId?: string;
}
