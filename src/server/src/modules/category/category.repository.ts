import prisma from "@/infra/database/database.config";

export class CategoryRepository {
  async findManyCategories(params: {
    where?: Record<string, any>;
    orderBy?: Record<string, any> | Record<string, any>[];
    skip?: number;
    take?: number;
    includeProducts?: boolean;
  }) {
    const { where, orderBy, skip, take, includeProducts } = params;
    return prisma.category.findMany({
      where,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
      include: {
        products: true,
      },
    });
  }

  async findCategoryById(id: string, includeProducts: boolean = false) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    images?: string[];
    attributes?: { attributeId: string; isRequired: boolean }[];
  }) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        images: data.images,
      },
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      images?: string[];
    }
  ) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}
