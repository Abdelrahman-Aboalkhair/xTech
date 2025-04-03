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
    console.log("guestCartId => ", guestCartId);
    const guestCart = await this.cartRepository.findCartWithItemsById(
      guestCartId
    );
    console.log("Guest cart => ", guestCart);
    if (!guestCart || !guestCart.cartItems.length) return;

    // Check if the user already has a cart
    const userCart = await this.cartRepository.findCartByUserId(userId);

    if (userCart) {
      // User has an existing cart, merge items into it
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
      // Delete the guest cart since items are merged
      await this.cartRepository.deleteCart(guestCartId);
      return userCart;
    } else {
      // User has no cart, reassign the guest cart to them
      console.log("updating guest cart with logged in user id => ", userId);
      await this.cartRepository.updateCart(guestCartId, { userId });
      return guestCart; // Return the reassigned cart
    }
  }
}

export default CartService;
