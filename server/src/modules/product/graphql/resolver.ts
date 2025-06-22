import AppError from "@/shared/errors/AppError";
import getCombinations from "@/shared/utils/getCombinations";
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
    getProductAttributes: async (_: any, { productId }: { productId: string }, context: Context) => {
      return context.prisma.productAttribute.findMany({
        where: { productId },
        include: {
          attribute: { include: { values: true } },
          value: true,
        },
      });
    },
    restocks: async (
      _: any,
      { params }: { params: { first: number; skip: number; productId?: string; startDate?: Date; endDate?: Date } },
      context: Context
    ) => {
      const { first, skip, productId, startDate, endDate } = params;
      const where: any = {};
      if (productId) where.productId = productId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
      return context.prisma.restock.findMany({
        where,
        take: first,
        skip,
        include: {
          product: true,
          attributes: {
            include: {
              attribute: { include: { values: true } },
              value: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    },
    inventorySummary: async (
      _: any,
      { params }: {
        params: {
          first?: number;
          skip?: number;
          filter?: {
            lowStockOnly?: boolean;
            productName?: string;
            attributeFilters?: { attributeId: string; valueId?: string; valueIds?: string[] }[];
          };
        }
      },
      context: Context
    ) => {
      const { first = 10, skip = 0, filter = {} } = params;
      const where: any = {};
      if (filter.productName) {
        where.name = { contains: filter.productName, mode: 'insensitive' };
      }

      if (filter?.attributeFilters?.length) {
        where.ProductAttribute = {
          some: {
            OR: filter.attributeFilters.map(attr => ({
              attributeId: attr.attributeId,
              valueId: attr.valueIds?.length ? { in: attr.valueIds } : attr.valueId,
            })),
          },
        };
      }

      if (filter.lowStockOnly) {
        where.ProductAttribute = {
          some: {
            stock: { lt: context.prisma.product.fields.lowStockThreshold },
          },
        };
      }

      const products = await context.prisma.product.findMany({
        where,
        take: first,
        skip,
        include: {
          ProductAttribute: {
            include: {
              attribute: { include: { values: true } },
              value: true,
            },
          },
          category: true,
        },
      });

      return Promise.all(products.map(async product => {
        const combinations = await getCombinations(product, context.prisma);
        const totalStock = product.stock; // Use Product.stock from creation
        const lowStock = product.ProductAttribute.some(
          (attr: any) => (attr.stock || 0) < product.lowStockThreshold
        );
        return {
          product,
          stock: totalStock,
          lowStock,
          combinations,
        };
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
      { input }: {
        input: {
          productId: string;
          quantity: number;
          notes?: string;
          attributes?: { attributeId: string; valueId?: string; valueIds?: string[] }[];
        };
      },
      context: Context
    ) => {
      const { productId, quantity, notes, attributes } = input;

      if (quantity <= 0) {
        throw new AppError(400, 'Quantity must be positive');
      }

      const product = await context.prisma.product.findUnique({
        where: { id: productId },
        include: { ProductAttribute: true },
      });

      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      let updatedAttributes;

      if (attributes?.length) {
        // Validate attributes
        for (const attr of attributes) {
          const valueIds = attr.valueIds || (attr.valueId ? [attr.valueId] : []);
          if (!valueIds.length) {
            throw new AppError(400, `No value provided for attribute ${attr.attributeId}`);
          }
          const existingAttrs = await context.prisma.productAttribute.findMany({
            where: {
              productId,
              attributeId: attr.attributeId,
              valueId: { in: valueIds },
            },
          });
          if (existingAttrs.length !== valueIds.length) {
            throw new AppError(400, `Invalid attribute values for ${attr.attributeId}`);
          }
        }

        // Update stock for specified attributes
        updatedAttributes = await context.prisma.$transaction(
          attributes.flatMap(attr =>
            (attr.valueIds || (attr.valueId ? [attr.valueId] : [])).map(valueId =>
              context.prisma.productAttribute.update({
                where: {
                  productId_attributeId_valueId: {
                    productId,
                    attributeId: attr.attributeId,
                    valueId,
                  },
                },
                data: {
                  stock: { increment: quantity },
                },
              })
            )
          )
        );
      } else {
        // Update total product stock
        await context.prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });
      }

      // Create restock record
      const restock = await context.prisma.restock.create({
        data: {
          productId,
          quantity,
          notes,
        },
        include: { product: true },
      });

      return restock;
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
