import AppError from "@/shared/errors/AppError";
import slugify from "@/shared/utils/slugify";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { CategoryRepository } from "./category.repository";
import prisma from "@/infra/database/database.config";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(queryString: Record<string, any>) {
    const apiFeatures = new ApiFeatures(queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    const { where, orderBy, skip, take } = apiFeatures;

    const categories = await this.categoryRepository.findManyCategories({
      where,
      orderBy,
      skip,
      take,
      includeProducts: true,
    });

    return categories;
  }

  async getCategory(categoryId: string) {
    const category = await this.categoryRepository.findCategoryById(
      categoryId,
      true
    );
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    return {
      ...category,
      productCount: category.products?.length || 0,
    };
  }

  async createCategory(data: {
    name: string;
    description?: string;
    images?: string[];
    attributes?: { attributeId: string; isRequired: boolean }[];
  }) {
    const slug = slugify(data.name);
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });
    if (existingCategory) {
      throw new AppError(400, "Category with this name already exists");
    }

    const category = await this.categoryRepository.createCategory({
      name: data.name,
      slug,
      description: data.description,
      images: data.images,
      attributes: data.attributes,
    });
    return { category };
  }

  async updateCategory(
    categoryId: string,
    data: {
      name?: string;
      description?: string;
      images?: string[];
    }
  ) {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    const slug = data.name ? slugify(data.name) : undefined;
    if (slug && slug !== category.slug) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });
      if (existingCategory) {
        throw new AppError(400, "Category with this name already exists");
      }
    }

    const updatedCategory = await this.categoryRepository.updateCategory(
      categoryId,
      {
        name: data.name,
        slug,
        description: data.description,
        images: data.images,
      }
    );
    return { category: updatedCategory };
  }

  async deleteCategory(categoryId: string) {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    await this.categoryRepository.deleteCategory(categoryId);
  }
}
