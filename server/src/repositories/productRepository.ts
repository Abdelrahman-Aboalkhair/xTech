import prisma from "../config/database";

class ProductRepository {
  async findManyProducts(params: {
    where?: Record<string, any>;
    orderBy?: Record<string, any> | Record<string, any>[];
    skip?: number;
    take?: number;
    select?: Record<string, any>;
  }) {
    const { where, orderBy, skip, take, select } = params;

    // Ensure where is not undefined or null
    const finalWhere = where || {}; // Default to an empty object if where is not provided

    // Ensure orderBy defaults to sorting by createdAt if not provided
    const finalOrderBy = orderBy || { createdAt: "desc" }; // Default order by createdAt in descending order

    // Ensure skip and take are set properly, default to pagination limits if not provided
    const finalSkip = skip || 0; // Default to skip = 0 (no offset)
    const finalTake = take || 10; // Default to take = 10 (limit to 10 products)

    // Pass the final parameters to Prisma's `findMany`
    return prisma.product.findMany({
      where: finalWhere,
      orderBy: finalOrderBy,
      skip: finalSkip,
      take: finalTake,
      select, // If select is provided, it will be used to limit the returned fields
    });
  }

  async findProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
    });
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

export default ProductRepository;
