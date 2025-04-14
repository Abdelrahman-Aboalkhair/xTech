import AppError from "@/shared/errors/AppError";
import { CartRepository } from "./cart.repository";

export class CartService {
  constructor(private cartRepository: CartRepository) {}

  async getOrCreateCart(userId?: string, sessionId?: string) {
    let cart;

    if (userId) {
      cart = await this.cartRepository.getCartByUserId(userId);
      if (!cart) {
        cart = await this.cartRepository.createCart({ userId });
      }
    } else if (sessionId) {
      cart = await this.cartRepository.getCartBySessionId(sessionId);
      if (!cart) {
        cart = await this.cartRepository.createCart({ sessionId });
      }
    } else {
      throw new AppError(400, "User ID or Session ID is required");
    }

    return cart;
  }

  async addToCart(
    productId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    return this.cartRepository.addItemToCart({
      cartId: cart.id,
      productId,
      quantity,
    });
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    return this.cartRepository.updateCartItemQuantity(itemId, quantity);
  }

  async removeFromCart(itemId: string) {
    return this.cartRepository.removeCartItem(itemId);
  }

  async mergeCartsOnLogin(sessionId: string, userId: string | undefined) {
    const sessionCart = await this.cartRepository.getCartBySessionId(sessionId);
    if (!sessionCart) return;

    const userCart = await this.getOrCreateCart(userId);
    await this.cartRepository.mergeCarts(sessionCart.id, userCart.id);
  }
}
