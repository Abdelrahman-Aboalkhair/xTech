import { Prisma } from "@prisma/client";
import prisma from "@/infra/database/database.config";

export class CartRepository {
  async getCartByUserId(userId: string) {
    return prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: { include: { variant: { include: { product: true } } } } },
    });
  }

  async getCartBySessionId(sessionId: string) {
    return prisma.cart.findUnique({
      where: { sessionId },
      include: { cartItems: { include: { variant: { include: { product: true } } } } },
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

  async findCartItem(cartId: string, variantId: string) {
    return prisma.cartItem.findFirst({
      where: { cartId, variantId },
    });
  }

  async addItemToCart(data: {
    cartId: string;
    variantId: string;
    quantity: number;
  }) {
    try {
      // Validate stock
      const variant = await prisma.productVariant.findUnique({
        where: { id: data.variantId },
        select: { stock: true },
      });
      if (!variant) {
        throw new Error("Variant not found");
      }
      if (variant.stock < data.quantity) {
        throw new Error(`Insufficient stock: only ${variant.stock} available`);
      }

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
    // Validate stock
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true },
    });
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    if (cartItem.variant.stock < quantity) {
      throw new Error(`Insufficient stock: only ${cartItem.variant.stock} available`);
    }

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
      include: { variant: true },
    });

    for (const item of sessionItems) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCartId, variantId: item.variantId },
      });
      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        if (item.variant.stock < newQuantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}: only ${item.variant.stock} available`);
        }
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        if (item.variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}: only ${item.variant.stock} available`);
        }
        await prisma.cartItem.create({
          data: {
            cartId: userCartId,
            variantId: item.variantId,
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
    const client = tx || prisma;
    const cart = await client.cart.findFirst({
      where: { userId },
    });

    console.log("found cart to be cleared => ", cart);

    if (!cart) {
      return;
    }

    return client.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}