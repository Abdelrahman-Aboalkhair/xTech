import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const productResolvers = {
  Query: {
    products: async (
      _: any,
      { first = 4, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count();
      const products = await context.prisma.product.findMany({
        take: first,
        skip,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    product: async (_: any, { slug }: { slug: string }, context: Context) => {
      return context.prisma.product.findUnique({
        where: { slug },
      });
    },
    newProducts: async (
      _: any,
      { first = 4, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isNew: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isNew: true },
        take: first,
        skip,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    featuredProducts: async (
      _: any,
      { first = 4, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isFeatured: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isFeatured: true },
        take: first,
        skip,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    trendingProducts: async (
      _: any,
      { first = 4, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isTrending: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isTrending: true },
        take: first,
        skip,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    bestSellerProducts: async (
      _: any,
      { first = 4, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isBestSeller: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isBestSeller: true },
        take: first,
        skip,
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
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
