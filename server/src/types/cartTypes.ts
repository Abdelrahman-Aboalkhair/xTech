export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  cart_id: string;
  userId: string;
  products: CartItem[];
}
