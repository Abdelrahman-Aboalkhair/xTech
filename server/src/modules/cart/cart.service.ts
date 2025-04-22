import AppError from "@/shared/errors/AppError";
import { CartRepository } from "./cart.repository";
import prisma from "@/infra/database/database.config";
import { CART_EVENT } from "@prisma/client";

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

  async logCartEvent(
    cartId: string,
    eventType: CART_EVENT,
    userId?: string
  ): Promise<void> {
    await prisma.cartEvent.create({
      data: {
        userId,
        cartId,
        eventType,
      },
    });
  }

  async getAbandonedCartMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalAbandonedCarts: number;
    abandonmentRate: number;
    potentialRevenueLost: number;
  }> {
    const cartEvents = await prisma.cartEvent.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cart: {
          include: { cartItems: true },
        },
        user: true,
      },
    });

    // Group events by cartId
    const cartEventsByCartId = cartEvents.reduce((acc: any, event) => {
      if (!acc[event.cartId]) acc[event.cartId] = [];
      acc[event.cartId].push(event); // * { cartId: [events] }
      return acc;
    }, {});

    let totalCarts = 0;
    let totalAbandonedCarts = 0;
    let potentialRevenueLost = 0;

    for (const cartId in cartEventsByCartId) {
      const events = cartEventsByCartId[cartId];
      const hasAddToCart = events.some((e: any) => e.eventType === "ADD");
      const hasCheckoutCompleted = events.some(
        (e: any) => e.eventType === "CHECKOUT_COMPLETED"
      );

      // Only count carts that have items
      const cart = events[0].cart;
      if (!cart || !cart.cartItems || cart.cartItems.length === 0) continue;

      totalCarts++;

      // Check if cart is abandoned (has ADD but no CHECKOUT_COMPLETED events within 1 hour)
      if (hasAddToCart && !hasCheckoutCompleted) {
        const addToCartEvent = events.find((e: any) => e.eventType === "ADD");
        const oneHourLater = new Date(
          addToCartEvent.timestamp.getTime() + 60 * 60 * 1000 // * 1 hour
        );
        const now = new Date();

        //? if now is after 1 hour later, cart is abandoned
        if (now > oneHourLater) {
          totalAbandonedCarts++;
          // ** calculate potential revenue lost
          potentialRevenueLost += cart.items.reduce(
            (sum: number, item: any) => sum + item.quantity * item.price,
            0
          );
        }
      }
    }

    const abandonmentRate =
      totalCarts > 0 ? (totalAbandonedCarts / totalCarts) * 100 : 0;

    return {
      totalAbandonedCarts,
      abandonmentRate,
      potentialRevenueLost,
    };
  }

  async getCartCount(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    return cart.cartItems.length;
  }

  async addToCart(
    productId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    const item = await this.cartRepository.addItemToCart({
      cartId: cart.id,
      productId,
      quantity,
    });

    await this.logCartEvent(cart.id, "ADD", userId);

    return item;
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
