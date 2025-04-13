import AppError from "../utils/AppError";
import slugify from "../utils/slugify";
import ApiFeatures from "../utils/ApiFeatures";
import CategoryRepository from "../repositories/categoryRepository";

class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

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

  async createCategory(name: string) {
    const category = await this.categoryRepository.createCategory({
      name,
      slug: slugify(name),
    });
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
