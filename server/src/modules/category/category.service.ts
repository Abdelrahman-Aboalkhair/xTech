import AppError from "@/shared/errors/AppError";
import slugify from "@/shared/utils/slugify";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { CategoryRepository } from "./category.repository";

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

    return await this.categoryRepository.findManyCategories({
      where,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
    });
  }

  async getCategory(categoryId: string) {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    return { category };
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    images?: string[];
  }) {
    const category = await this.categoryRepository.createCategory(data);
    return { category };
  }

  async deleteCategory(categoryId: string) {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    await this.categoryRepository.deleteCategory(categoryId);
  }
}

export default CategoryService;
