import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import slugify from "@/shared/utils/slugify";

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
        where.attributes = {
          some: {
            OR: filters.attributes.map((attr) => ({
              AND: [
                { attribute: { slug: attr.attributeSlug } },
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
    inventorySummary: async (_: any, __: any, context: Context) => {
      const products = await context.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          stock: true,
        },
      });
      return products.map((product) => ({
        product,
        stock: product.stock,
        lowStock: product.stock < 10, // Example threshold
      }));
    },
  },

  Mutation: {
    restockProduct: async (
      _: any,
      {
        productId,
        quantity,
        notes,
      }: { productId: string; quantity: number; notes?: string },
      context: Context
    ) => {
      if (quantity <= 0) throw new Error("Quantity must be positive");

      const restock = await context.prisma.restock.create({
        data: {
          productId,
          quantity,
          notes,
          userId: context.req.user?.id,
        },
        include: { product: true },
      });

      await context.prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
      });

      await context.prisma.stockMovement.create({
        data: {
          productId,
          quantity,
          reason: "restock",
          userId: context.req.user?.id,
        },
      });

      return restock;
    },
    adjustStock: async (
      _: any,
      {
        productId,
        quantity,
        reason,
      }: { productId: string; quantity: number; reason: string },
      context: Context
    ) => {
      const product = await context.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) throw new Error("Product not found");
      if (product.stock + quantity < 0)
        throw new Error("Stock cannot be negative");

      const stockMovement = await context.prisma.stockMovement.create({
        data: {
          productId,
          quantity,
          reason,
          userId: context.req.user?.id,
        },
        include: { product: true },
      });

      await context.prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
      });

      return stockMovement;
    },
    createAttribute: async (
      _: any,
      { name, type }: { name: string; type: string },
      context: Context
    ) => {
      return context.prisma.attribute.create({
        data: {
          name,
          slug: slugify(name),
          type,
        },
        include: { values: true },
      });
    },
    createAttributeValue: async (
      _: any,
      { attributeId, value }: { attributeId: string; value: string },
      context: Context
    ) => {
      return context.prisma.attributeValue.create({
        data: {
          attributeId,
          value,
          slug: slugify(value),
        },
      });
    },
    assignAttributeToCategory: async (
      _: any,
      {
        attributeId,
        categoryId,
        isRequired,
      }: { attributeId: string; categoryId: string; isRequired: boolean },
      context: Context
    ) => {
      return context.prisma.categoryAttribute.create({
        data: {
          attributeId,
          categoryId,
          isRequired,
        },
        include: { attribute: true },
      });
    },
    assignAttributeToProduct: async (
      _: any,
      {
        attributeId,
        productId,
        valueId,
        customValue,
      }: {
        attributeId: string;
        productId: string;
        valueId?: string;
        customValue?: string;
      },
      context: Context
    ) => {
      return context.prisma.productAttribute.create({
        data: {
          attributeId,
          productId,
          valueId,
          customValue,
        },
        include: {
          attribute: true,
          value: true,
        },
      });
    },
    deleteAttribute: async (
      _: any,
      { id }: { id: string },
      context: Context
    ) => {
      await context.prisma.attribute.delete({ where: { id } });
      return true;
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
