import prisma from "../config/database";

class CheckoutRepository {
  // Fetch user's cart with items and products
  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
  }

  // Create an order from cart data
  async createOrder(data: {
    userId: string;
    amount: number;
    orderItems: { productId: string; quantity: number }[];
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        orderItems: {
          create: data.orderItems,
        },
      },
      include: { orderItems: true },
    });
  }

  // Clear cart items after order is placed
  async deleteCartItemsByCartId(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}

export default CheckoutRepository;
