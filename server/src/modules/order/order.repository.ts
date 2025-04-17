import prisma from "@/infra/database/database.config";

export class OrderRepository {
  async findAllOrders() {
    return prisma.order.findMany({
      orderBy: { orderDate: "desc" },
    });
  }
  async findOrdersByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { orderDate: "desc" },
    });
  }

  async findOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        payment: true,
        address: true,
        shipment: true,
      },
    });
  }

  async createOrder(data: {
    userId: string;
    amount: number;
    orderItems: { productId: string; quantity: number; price: number }[];
  }) {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        orderItems: {
          create: data.orderItems,
        },
      },
    });

    return order;
  }
}
