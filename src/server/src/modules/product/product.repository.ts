// server/src/modules/product/product.repository.ts
import prisma from "@/infra/database/database.config";
import { Prisma } from "@prisma/client";

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
              slug: {
                equals: categorySlug,
                mode: "insensitive",
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
      include: { category: true },
    });
  }

  async countProducts(params: { where?: Prisma.ProductWhereInput }) {
    const { where = {} } = params;
    return prisma.product.count({ where });
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
      select: { id: true, name: true, slug: true },
    });
  }

  async findProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  }

  async createProduct(data: {
    name: string;
    slug: string;
    price: number;
    description?: string;
    images?: string[];
    videoUrl?: string;
    categoryId?: string;
  }) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      price: number;
      description?: string;
      images?: string[];
      videoUrl?: string;
      categoryId?: string;
    }>
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
