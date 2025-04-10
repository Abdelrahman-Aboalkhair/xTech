import { ORDER_STATUS } from "@prisma/client";
import prisma from "../config/database";

class OrderRepository {
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
        tracking: true,
        payment: true,
        address: true,
        shipment: true,
      },
    });
  }

  async createOrder(data: {
    userId: string;
    amount: number;
    orderItems: { productId: string; quantity: number }[];
    status: ORDER_STATUS;
  }) {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        orderItems: {
          create: data.orderItems,
        },
        status: data.status || "PENDING",
      },
    });

    return order;
  }
}

export default OrderRepository;
