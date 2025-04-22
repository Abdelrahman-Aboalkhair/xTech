import { Prisma } from "@prisma/client";
import prisma from "@/infra/database/database.config";

export class CartRepository {
  async getCartByUserId(userId: string) {
    return prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
  }

  async getCartBySessionId(sessionId: string) {
    return prisma.cart.findUnique({
      where: { sessionId },
      include: { cartItems: { include: { product: true } } },
    });
  }

  async createCart(data: { userId?: string; sessionId?: string }) {
    return prisma.cart.create({
      data,
      include: {
        cartItems: true,
      },
    });
  }

  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: { cartId, productId },
    });
  }

  async addItemToCart(data: {
    cartId: string;
    productId: string;
    quantity: number;
  }) {
    try {
      return await prisma.cartItem.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Item already exists in cart");
      }
      throw error;
    }
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeCartItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  async mergeCarts(sessionCartId: string, userCartId: string) {
    const sessionItems = await prisma.cartItem.findMany({
      where: { cartId: sessionCartId },
    });

    for (const item of sessionItems) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCartId, productId: item.productId },
      });
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCartId,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }
    await prisma.cart.delete({ where: { id: sessionCartId } });
  }

  async deleteCart(id: string) {
    return prisma.cart.delete({ where: { id } });
  }

  async clearCart(userId: string, tx?: Prisma.TransactionClient) {
    const cart = await tx?.cart.findFirst({
      where: { userId },
    });

    console.log("found cart to be cleared => ", cart);

    if (!cart) {
      return;
    }

    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
