import { PrismaClient } from "@prisma/client";

export class AnalyticsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getOrdersByTimePeriod(
    start?: Date,
    end?: Date,
    yearStart?: Date,
    yearEnd?: Date
  ) {
    return this.prisma.order.findMany({
      where: {
        orderDate: {
          gte: start || yearStart,
          lte: end || yearEnd,
        },
      },
      include: { user: true },
    });
  }

  async getOrderItemsByTimePeriod(
    start?: Date,
    end?: Date,
    yearStart?: Date,
    yearEnd?: Date,
    category?: string
  ) {
    return this.prisma.orderItem.findMany({
      where: {
        createdAt: {
          gte: start || yearStart,
          lte: end || yearEnd,
        },
        ...(category && {
          product: {
            category: {
              name: category,
            },
          },
        }),
      },
      include: { product: true },
    });
  }

  async getUsersByTimePeriod(
    start?: Date,
    end?: Date,
    yearStart?: Date,
    yearEnd?: Date
  ) {
    return this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: start || yearStart,
          lte: end || yearEnd,
        },
      },
      include: { orders: true },
    });
  }
  async getInteractionsByTimePeriod(
    start?: Date,
    end?: Date,
    yearStart?: Date,
    yearEnd?: Date
  ) {
    return this.prisma.interaction.findMany({
      where: {
        createdAt: {
          gte: start || yearStart,
          lte: end || yearEnd,
        },
      },
      include: { user: true, product: true },
    });
  }
}
