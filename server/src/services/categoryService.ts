import prisma from "../config/database";
import AppError from "../utils/AppError";

class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany();
    return { categories };
  }

  static async createCategory(name: string) {
    const category = await prisma.category.create({ data: { name } });
    return { category };
  }

  static async deleteCategory(categoryId: number) {
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
