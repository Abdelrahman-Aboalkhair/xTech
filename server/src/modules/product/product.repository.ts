import { Prisma } from "@prisma/client";
import prisma from "@/infra/database/database.config";

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
      orderBy = { createdAt: "desc" },
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
                  mode: "insensitive",
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

  async updateProductStock(id: string, stock: number) {
    return prisma.product.update({
      where: { id },
      data: { stock },
    });
  }

  async findProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
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
    slug: string;
    description?: string;
    price: number;
    discount: number;
    images: string[];
    stock: number;
    categoryId?: string;
  }) {
    return prisma.product.create({ data });
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

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      discount: number;
      images: string[];
      stock: number;
      categoryId?: string;
    }>
  ) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
