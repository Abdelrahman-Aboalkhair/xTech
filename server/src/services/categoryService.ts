import prisma from "../config/database";
import AppError from "../utils/AppError";
import slugify from "../utils/slugify";

class CategoryService {
  static async getAllCategories() {
    return await prisma.category.findMany();
  }

  static async createCategory(name: string) {
    const category = await prisma.category.create({
      data: { name, slug: slugify(name) },
    });
    return { category };
  }

  static async deleteCategory(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    await prisma.category.delete({ where: { id: categoryId } });
  }
}

export default CategoryService;
