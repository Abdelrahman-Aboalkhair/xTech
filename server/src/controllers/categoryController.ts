import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CategoryService from "../services/categoryService";
import { CreateCategoryDto } from "../dtos/categoryDto";

class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  getAllCategories = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const categories = await this.categoryService.getAllCategories(req.query);
      sendResponse(res, 200, { categories }, "Categories fetched successfully");
    }
  );

  createCategory = asyncHandler(
    async (
      req: Request<any, any, CreateCategoryDto>,
      res: Response
    ): Promise<void> => {
      const { name } = req.body;
      const { category } = await this.categoryService.createCategory(name);
      sendResponse(res, 201, { category }, "Category created successfully");
    }
  );

  deleteCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: categoryId } = req.params;
      await this.categoryService.deleteCategory(categoryId);
      sendResponse(res, 204, {}, "Category deleted successfully");
    }
  );
}

export default new CategoryController(new CategoryService());
