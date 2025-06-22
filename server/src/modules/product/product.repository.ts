import { Prisma } from '@prisma/client';
import prisma from '@/infra/database/database.config';

export class ProductRepository {
  async findManyProducts(params: {
    where?: Prisma.ProductWhereInput & { categorySlug?: string };
    orderBy?:
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[];
    skip?: number;
    take?: number;
    select?: Prisma.ProductSelect;
  }) {
    const {
      where = {},
      orderBy = { createdAt: 'desc' },
      skip = 0,
      take = 10,
      select,
    } = params;

    const { categorySlug, ...restWhere } = where;

    const finalWhere: Prisma.ProductWhereInput = {
      ...restWhere,
      ...(categorySlug
        ? {
          category: {
            is: {
              slug: {
                equals: categorySlug,
                mode: 'insensitive',
              },
            },
          },
        }
        : {}),
    };

    return prisma.product.findMany({
      where: finalWhere,
      orderBy,
      skip,
      take,
      select,
    });
  }

  async countProducts(params: { where?: Prisma.ProductWhereInput }) {
    const { where = {} } = params;

    return prisma.product.count({
      where,
    });
  }

  async createRestock(data: {
    productId: string;
    quantity: number;
    notes?: string;
    userId?: string;
  }) {
    return prisma.restock.create({
      data,
      include: { product: true },
    });
  }

  async updateProductStock(productId: string, quantity: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });
  }

  async createStockMovement(data: {
    productId: string;
    quantity: number;
    reason: string;
    userId?: string;
  }) {
    return prisma.stockMovement.create({
      data,
    });
  }

  async findProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
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
  }

  async findProductByName(name: string) {
    return prisma.product.findUnique({
      where: { name },
      select: {
        sku: true,
        price: true,
        images: true,
        slug: true,
      },
    });
  }

  async findProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
    });
  }

  async findProductNameById(id: string): Promise<string | null> {
    const product = await this.findProductById(id);
    return product?.name || null;
  }

  async createProduct(data: {
    name: string;
    sku: string;
    isNew: boolean;
    isTrending: boolean;
    isBestSeller: boolean;
    isFeatured: boolean;
    slug: string;
    description?: string;
    price: number;
    discount: number;
    images?: string[];
    stock: number;
    categoryId?: string;
    attributes?: {
      attributeId: string;
      valueId: string;
      stock: number;
    }[];
  }) {
    const { attributes, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        ProductAttribute: attributes
          ? {
            create: attributes.map((attr) => ({
              attributeId: attr.attributeId,
              valueId: attr.valueId,
              stock: attr.stock,
            })),
          }
          : undefined,
      },
      include: {
        ProductAttribute: {
          include: {
            attribute: true,
            value: true,
          },
        },
      },
    });
  }

  async createManyProducts(
    data: {
      name: string;
      slug: string;
      description?: string;
      price: number;
      discount: number;
      images: string[];
      stock: number;
      categoryId?: string;
    }[]
  ) {
    return prisma.product.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async incrementSalesCount(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { salesCount: { increment: quantity } },
    });
  }

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      sku: string;
      isNew: boolean;
      isTrending: boolean;
      isBestSeller: boolean;
      isFeatured: boolean;
      slug: string;
      description?: string;
      price: number;
      discount: number;
      images?: string[];
      stock: number;
      categoryId?: string;
      attributes?: {
        attributeId: string;
        valueId: string;
        stock: number;
      }[];
    }>
  ) {
    const { attributes, ...productData } = data;

    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ProductAttribute: attributes
          ? {
            create: attributes.map((attr) => ({
              attributeId: attr.attributeId,
              valueId: attr.valueId,
              stock: attr.stock,
            })),
          }
          : undefined,
      },
      include: {
        ProductAttribute: {
          include: {
            attribute: true,
            value: true,
          },
        },
      },
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
