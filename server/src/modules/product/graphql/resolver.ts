import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const productResolvers = {
  Query: {
    products: async (_: any, __: any, context: Context) => {
      return context.prisma.product.findMany();
    },
    product: async (_: any, args: { id: string }, context: Context) => {
      return context.prisma.product.findUnique({
        where: { id: args.id },
      });
    },
  },
  Product: {
    reviews: (parent: any, _: any, context: Context) => {
      return context.prisma.review.findMany({
        where: { productId: parent.id },
      });
    },
  },
};
