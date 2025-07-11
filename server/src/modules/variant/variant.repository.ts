import { Prisma } from '@prisma/client';
import prisma from '@/infra/database/database.config';

export class VariantRepository {
  async findManyVariants(params: {
    where?: Prisma.ProductVariantWhereInput & { productSlug?: string };
    orderBy?:
      | Prisma.ProductVariantOrderByWithRelationInput
      | Prisma.ProductVariantOrderByWithRelationInput[];
    skip?: number;
    take?: number;
    select?: Prisma.ProductVariantSelect;
  }) {
    const {
      where = {},
      orderBy = { createdAt: 'desc' },
      skip = 0,
      take = 10,
      select,
    } = params;

    const { productSlug, ...restWhere } = where;

    const finalWhere: Prisma.ProductVariantWhereInput = {
      ...restWhere,
      ...(productSlug
        ? {
            product: {
              slug: {
                equals: productSlug,
                mode: 'insensitive',
              },
            },
          }
        : {}),
    };

    return prisma.productVariant.findMany({
      where: finalWhere,
      orderBy,
      skip,
      take,
      select,
      include: select?.attributes
        ? {
            attributes: {
              include: {
                attribute: true,
                value: true,
              },
            },
            product: true,
          }
        : { product: true },
    });
  }

  async countVariants(params: { where?: Prisma.ProductVariantWhereInput }) {
    const { where = {} } = params;
    return prisma.productVariant.count({ where });
  }

  async findVariantById(id: string) {
    return prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: true,
        attributes: {
          include: {
            attribute: true,
            value: true,
          },
        },
      },
    });
  }

  async findVariantBySku(sku: string) {
    return prisma.productVariant.findUnique({
      where: { sku },
      include: {
        product: true,
        attributes: {
          include: {
            attribute: true,
            value: true,
          },
        },
      },
    });
  }

  async createVariant(data: {
    productId: string;
    sku: string;
    price: number;
    stock: number;
    lowStockThreshold?: number;
    barcode?: string;
    warehouseLocation?: string;
    attributes: { attributeId: string; valueId: string }[];
  }) {
    const { attributes, ...variantData } = data;
    return prisma.productVariant.create({
      data: {
        ...variantData,
        attributes: {
          create: attributes.map((attr) => ({
            attributeId: attr.attributeId,
            valueId: attr.valueId,
          })),
        },
      },
      include: {
        attributes: {
          include: {
            attribute: true,
            value: true,
          },
        },
        product: true,
      },
    });
  }

  async updateVariant(
    id: string,
    data: Partial<{
      sku: string;
      price: number;
      stock: number;
      lowStockThreshold?: number;
      barcode?: string;
      warehouseLocation?: string;
      attributes: { attributeId: string; valueId: string }[];
    }>
  ) {
    const { attributes, ...variantData } = data;
    return prisma.productVariant.update({
      where: { id },
      data: {
        ...variantData,
        ...(attributes
          ? {
              attributes: {
                deleteMany: {},
                create: attributes.map((attr) => ({
                  attributeId: attr.attributeId,
                  valueId: attr.valueId,
                })),
              },
            }
          : {}),
      },
      include: {
        attributes: {
          include: {
            attribute: true,
            value: true,
          },
        },
        product: true,
      },
    });
  }

  async deleteVariant(id: string) {
    return prisma.productVariant.delete({
      where: { id },
    });
  }

  async createRestock(data: {
    variantId: string;
    quantity: number;
    notes?: string;
    userId?: string;
  }) {
    return prisma.restock.create({
      data,
      include: { variant: true },
    });
  }

  async updateVariantStock(variantId: string, quantity: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    });
  }

  async createStockMovement(data: {
    variantId: string;
    quantity: number;
    reason: string;
    userId?: string;
  }) {
    return prisma.stockMovement.create({
      data,
    });
  }
}