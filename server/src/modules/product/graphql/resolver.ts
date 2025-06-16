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
      {
        first = 10,
        skip = 0,
        filters = {},
      }: {
        first?: number;
        skip?: number;
        filters?: {
          search?: string;
          isNew?: boolean;
          isFeatured?: boolean;
          isTrending?: boolean;
          isBestSeller?: boolean;
          minPrice?: number;
          maxPrice?: number;
          categoryId?: string;
          attributes?: { attributeSlug: string; valueSlug: string }[];
        };
      },
      context: Context
    ) => {
      const where: any = {};

      // Search filter
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Flag filters
      if (filters.isNew !== undefined) where.isNew = filters.isNew;
      if (filters.isFeatured !== undefined)
        where.isFeatured = filters.isFeatured;
      if (filters.isTrending !== undefined)
        where.isTrending = filters.isTrending;
      if (filters.isBestSeller !== undefined)
        where.isBestSeller = filters.isBestSeller;

      // Price filters
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
      }

      // Category filter
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }

      // Attribute filters
      if (filters.attributes && filters.attributes.length > 0) {
        // Look inside the attributes
        where.attributes = {
          // We want at least one attribute
          some: {
            // we're following any of the attribute filters to match (not all at once)
            OR: filters.attributes.map((attr) => ({
              AND: [
                // For each attribute, the slug must match
                { attribute: { slug: attr.attributeSlug } },
                // And the value slug must match
                {
                  OR: [
                    { value: { slug: attr.valueSlug } },
                    { customValue: attr.valueSlug },
                  ],
                },
              ],
            })),
          },
        };
      }

      const totalCount = await context.prisma.product.count({ where });
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        include: {
          category: true,
          ProductAttribute: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
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
        include: {
          category: true,
          ProductAttribute: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
      });
    },
    newProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isNew: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isNew: true },
        take: first,
        skip,
        include: {
          category: true,
          ProductAttribute: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    featuredProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isFeatured: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isFeatured: true },
        take: first,
        skip,
        include: {
          category: true,
          ProductAttribute: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    trendingProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isTrending: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isTrending: true },
        take: first,
        skip,
        include: {
          category: true,
          ProductAttribute: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    bestSellerProducts: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      const totalCount = await context.prisma.product.count({
        where: { isBestSeller: true },
      });
      const products = await context.prisma.product.findMany({
        where: { isBestSeller: true },
        take: first,
        skip,
        include: {
          category: true,
          ProductAttribute: {
            include: {
              attribute: true,
              value: true,
            },
          },
        },
      });
      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount,
      };
    },
    categories: async (_: any, __: any, context: Context) => {
      return context.prisma.category.findMany({
        include: {
          products: {
            include: {
              ProductAttribute: true,
            },
          },
        },
      });
    },
    attributes: async (
      _: any,
      { first = 10, skip = 0 }: { first?: number; skip?: number },
      context: Context
    ) => {
      return context.prisma.attribute.findMany({
        take: first,
        skip,
        include: { values: true },
      });
    },
    attribute: async (_: any, { id }: { id: string }, context: Context) => {
      return context.prisma.attribute.findUnique({
        where: { id },
        include: { values: true },
      });
    },
    stockMovements: async (
      _: any,
      {
        productId,
        startDate,
        endDate,
      }: { productId?: string; startDate?: Date; endDate?: Date },
      context: Context
    ) => {
      const where: any = {};
      if (productId) where.productId = productId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
      return context.prisma.stockMovement.findMany({
        where,
        include: { product: true },
      });
    },
    restocks: async (
      _: any,
      {
        productId,
        startDate,
        endDate,
      }: { productId?: string; startDate?: Date; endDate?: Date },
      context: Context
    ) => {
      const where: any = {};
      if (productId) where.productId = productId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
      return context.prisma.restock.findMany({
        where,
        include: { product: true },
      });
    },
    inventorySummary: async (
      _: any,
      { first = 10, skip = 0, filter = {} }: { first?: number; skip?: number; filter?: { lowStockOnly?: boolean; productName?: string } },
      context: Context
    ) => {
      const where: any = {};
      if (filter.productName) {
        where.name = { contains: filter.productName, mode: "insensitive" };
      }
      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        select: { id: true, name: true, stock: true, lowStockThreshold: true },
      });
      return products.map((product) => ({
        product,
        stock: product.stock,
        lowStock: product.stock < (product.lowStockThreshold || 10),
      }));
    },
    stockMovementsByProduct: async (
      _: any,
      { productId, startDate, endDate, first = 10, skip = 0 }: { productId: string; startDate?: Date; endDate?: Date; first?: number; skip?: number },
      context: Context
    ) => {
      const where: any = { productId };
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
      return context.prisma.stockMovement.findMany({
        where,
        take: first,
        skip,
        include: { product: true },
        orderBy: { createdAt: "desc" },
      });
    },

  },

  Mutation: {
    restockProduct: async (
      _: any,
      { productId, quantity, notes }: { productId: string; quantity: number; notes?: string },
      context: Context
    ) => {
      if (quantity <= 0) throw new Error("Quantity must be positive");

      return context.prisma.$transaction(async (tx) => {
        const restock = await tx.restock.create({
          data: {
            productId,
            quantity,
            notes,
            userId: context.req.user?.id,
          },
          include: { product: true },
        });

        await tx.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });

        await tx.stockMovement.create({
          data: {
            productId,
            quantity,
            reason: "restock",
            userId: context.req.user?.id,
          },
        });

        return restock;
      });
    },
    setLowStockThreshold: async (
      _: any,
      { productId, threshold }: { productId: string; threshold: number },
      context: Context
    ) => {
      if (threshold < 0) throw new Error("Threshold cannot be negative");
      return context.prisma.product.update({
        where: { id: productId },
        data: { lowStockThreshold: threshold },
      });
    },

  },

  Product: {
    reviews: (parent: any, _: any, context: Context) => {
      return context.prisma.review.findMany({
        where: { productId: parent.id },
      });
    },
    attributes: (parent: any, _: any, context: Context) => {
      return context.prisma.productAttribute.findMany({
        where: { productId: parent.id },
        include: {
          attribute: true,
          value: true,
        },
      });
    },
  },

  Category: {
    attributes: (parent: any, _: any, context: Context) => {
      return context.prisma.categoryAttribute.findMany({
        where: { categoryId: parent.id },
        include: { attribute: true },
      });
    },
  },
};
