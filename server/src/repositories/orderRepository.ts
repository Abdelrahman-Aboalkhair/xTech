import prisma from "../config/database";

class OrderRepository {
  async findAllOrders() {
    return prisma.order.findMany({
      include: {
        orderItems: { include: { product: true } },
        tracking: true,
      },
      orderBy: { orderDate: "desc" },
    });
  }
  // Get all orders for a user
  async findOrdersByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
        tracking: true,
      },
      orderBy: { orderDate: "desc" },
    });
  }

  // Get a specific order by ID
  async findOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        tracking: true,
      },
    });
  }

  // Create an order (used by checkout webhook)
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

  // Update or create tracking details for an order
  async upsertTrackingDetail(orderId: string, status: string) {
    return prisma.trackingDetail.upsert({
      where: { orderId },
      update: { status },
      create: {
        orderId,
        status,
      },
    });
  }

  // Get tracking details for an order
  async findTrackingDetailByOrderId(orderId: string) {
    return prisma.trackingDetail.findUnique({
      where: { orderId },
    });
  }
}

export default OrderRepository;
