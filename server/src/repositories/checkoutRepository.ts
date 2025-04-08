import prisma from "../config/database";

class CheckoutRepository {
  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
  }

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

  async createPayment(data: {
    userId: string;
    method: string;
    amount: number;
  }) {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        method: data.method,
        amount: data.amount,
      },
    });
  }

  async createAddress(data: {
    userId: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  }) {
    return prisma.address.create({
      data: {
        userId: data.userId,
        city: data.city,
        state: data.state,
        street: data.street,
        country: data.country,
        zip: data.zip,
      },
    });
  }

  async createTrackingDetail(data: { orderId: string }) {
    return prisma.trackingDetail.create({
      data: {
        orderId: data.orderId,
      },
    });
  }

  async deleteCartItemsByCartId(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}

export default CheckoutRepository;
