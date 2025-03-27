import prisma from "../config/database";
import { CartItem, CartLookupParams } from "../types/cartTypes";
import AppError from "../utils/AppError";

class CartService {
  static async getCart({ userId, cartId }: CartLookupParams = {}) {
    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { cartItems: { include: { product: true } } },
        });
      }
    } else if (cartId) {
      cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: { include: { product: true } } },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { id: cartId },
          include: { cartItems: { include: { product: true } } },
        });
      }
    } else {
      cart = await prisma.cart.create({
        data: {},
        include: { cartItems: { include: { product: true } } },
      });
    }
    return cart;
  }

  static async addToCart(
    { userId, cartId }: CartLookupParams,
    { productId, quantity }: CartItem
  ) {
    const cart = await this.getCart({ userId, cartId });

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return this.getCart({ userId, cartId });
  }

  static async updateCartItem(
    { userId, cartId }: CartLookupParams,
    { productId, quantity }: CartItem
  ) {
    const cart = await this.getCart({ userId, cartId });

    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new AppError(404, "Product not in cart");
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    }

    return this.getCart({ userId, cartId });
  }

  static async removeFromCart(
    { userId, cartId }: CartLookupParams,
    productId: string
  ) {
    const cart = await this.getCart({ userId, cartId });

    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new AppError(404, "Product not in cart");
    }

    await prisma.cartItem.delete({ where: { id: cartItem.id } });
    return this.getCart({ userId, cartId });
  }

  static async clearCart({ userId, cartId }: CartLookupParams) {
    const cart = await this.getCart({ userId, cartId });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart({ userId, cartId });
  }

  static async mergeGuestCartIntoUserCart(guestCartId: string, userId: string) {
    const guestCart = await prisma.cart.findUnique({
      where: { id: guestCartId },
      include: { cartItems: true },
    });
    if (!guestCart || !guestCart.cartItems.length) return;

    const userCart = await this.getCart({ userId });

    for (const item of guestCart.cartItems) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCart.id, productId: item.productId },
      });
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    await prisma.cart.delete({ where: { id: guestCartId } });
    return this.getCart({ userId });
  }
}

export default CartService;
