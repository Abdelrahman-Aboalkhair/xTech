import { Order, OrderItem } from "@prisma/client";
import prisma from "../config/database";

class DashboardRepository {
  constructor() {}

  async getOrdersByTimePeriod(
    startDate?: Date,
    endDate?: Date,
    yearStart?: Date,
    yearEnd?: Date
  ): Promise<Order[]> {
    return prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate || yearStart,
          ...(endDate && { lt: endDate }),
          ...(yearEnd && { lte: yearEnd }),
        },
      },
      include: {
        orderItems: true,
      },
    });
  }

  async getOrderItemsByTimePeriod(
    startDate?: Date,
    endDate?: Date,
    yearStart?: Date,
    yearEnd?: Date
  ): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: {
        order: {
          orderDate: {
            gte: startDate || yearStart,
            ...(endDate && { lt: endDate }),
            ...(yearEnd && { lte: yearEnd }),
          },
        },
      },
      include: {
        order: true,
        product: true,
      },
    });
  }

  async getOrderYearRange(): Promise<{ minYear: number; maxYear: number }> {
    const earliestOrder = await prisma.order.findFirst({
      orderBy: { orderDate: "asc" },
      select: { orderDate: true },
    });
    const latestOrder = await prisma.order.findFirst({
      orderBy: { orderDate: "desc" },
      select: { orderDate: true },
    });

    const minYear = earliestOrder
      ? earliestOrder.orderDate.getFullYear()
      : new Date().getFullYear();
    const maxYear = latestOrder
      ? latestOrder.orderDate.getFullYear()
      : new Date().getFullYear();

    return { minYear, maxYear };
  }
  async getUsersByTimePeriod(
    startDate?: Date,
    endDate?: Date,
    yearStart?: Date,
    yearEnd?: Date
  ) {
    return prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate ?? yearStart,
          lte: endDate ?? yearEnd,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        orders: true,
        avatar: true,
      },
    });
  }
}

export default DashboardRepository;
