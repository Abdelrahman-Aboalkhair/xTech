import { Order, OrderItem } from "@prisma/client";
import prisma from "../config/database";

class DashboardRepository {
  constructor() {}

  async getOrdersByTimePeriod(
    startDate?: Date,
    endDate?: Date
  ): Promise<Order[]> {
    return prisma.order.findMany({
      where: {
        orderDate: {
          // *Get orders within the specified time period
          gte: startDate,
          ...(endDate && { lt: endDate }),
        },
      },
    });
  }

  async getOrderItemsByTimePeriod(
    startDate?: Date,
    endDate?: Date
  ): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: {
        order: {
          orderDate: {
            gte: startDate,
            ...(endDate && { lt: endDate }),
          },
        },
      },
    });
  }
}

export default DashboardRepository;
