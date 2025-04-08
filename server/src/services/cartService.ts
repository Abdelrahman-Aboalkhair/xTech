import { CartLookupParams, CartItem } from "../types/cartTypes";
import AppError from "../utils/AppError";
import CartRepository from "../repositories/cartRepository";

class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCart({ userId, cartId }: CartLookupParams = {}) {
    let cart;
    if (userId) {
      cart = await this.cartRepository.findCartByUserId(userId);
      if (!cart) {
        cart = await this.cartRepository.createCart({ userId });
      }
    } else if (cartId) {
      cart = await this.cartRepository.findCartById(cartId);
      if (!cart) {
        cart = await this.cartRepository.createCart({ id: cartId });
      }
    } else {
      cart = await this.cartRepository.createCart({});
    }
    return cart;
  }

  async addToCart(
    { userId, cartId }: CartLookupParams,
    { productId, quantity }: CartItem
  ) {
    const cart = await this.getCart({ userId, cartId });

    const existingItem = await this.cartRepository.findCartItem(
      cart.id,
      productId
    );

    if (existingItem) {
      await this.cartRepository.updateCartItem(existingItem.id, {
        quantity: existingItem.quantity + quantity,
      });
    } else {
      await this.cartRepository.createCartItem({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    return this.getCart({ userId, cartId });
  }

  async updateCartItem(
    { userId, cartId }: CartLookupParams,
    { productId, quantity }: CartItem
  ) {
    const cart = await this.getCart({ userId, cartId });

    const cartItem = await this.cartRepository.findCartItem(cart.id, productId);

    if (!cartItem) {
      throw new AppError(404, "Product not in cart");
    }

    if (quantity <= 0) {
      await this.cartRepository.deleteCartItem(cartItem.id);
    } else {
      await this.cartRepository.updateCartItem(cartItem.id, { quantity });
    }

    return this.getCart({ userId, cartId });
  }

  async removeFromCart(
    { userId, cartId }: CartLookupParams,
    productId: string
  ) {
    const cart = await this.getCart({ userId, cartId });

    const cartItem = await this.cartRepository.findCartItem(cart.id, productId);

    if (!cartItem) {
      throw new AppError(404, "Product not in cart");
    }

    await this.cartRepository.deleteCartItem(cartItem.id);
    return this.getCart({ userId, cartId });
  }

  async clearCart({ userId, cartId }: CartLookupParams) {
    const cart = await this.getCart({ userId, cartId });
    await this.cartRepository.deleteCartItemsByCartId(cart.id);
    return this.getCart({ userId, cartId });
  }

  async mergeGuestCartIntoUserCart(guestCartId: string, userId: string) {
    const guestCart = await this.cartRepository.findCartWithItemsById(
      guestCartId
    );
    if (!guestCart || !guestCart.cartItems.length) return;

    const userCart = await this.cartRepository.findCartByUserId(userId);

    if (userCart) {
      // Merge items from guestCart into userCart.
      for (const item of guestCart.cartItems) {
        const existingItem = await this.cartRepository.findCartItem(
          userCart.id,
          item.productId
        );
        if (existingItem) {
          await this.cartRepository.updateCartItem(existingItem.id, {
            quantity: existingItem.quantity + item.quantity,
          });
        } else {
          await this.cartRepository.createCartItem({
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }
      // Delete the now-merged guest cart.
      await this.cartRepository.deleteCart(guestCartId);
      return userCart;
    } else {
      // No user cart exists; update the guest cart by adding the userId.
      const updatedCart = await this.cartRepository.updateCart(guestCartId, {
        userId,
      });
      return updatedCart;
    }
  }
}

export default CartService;
