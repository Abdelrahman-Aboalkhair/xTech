import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import CategoryService from "./category.service";
import { CreateCategoryDto } from "./category.dto";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  getAllCategories = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const categories = await this.categoryService.getAllCategories(req.query);
      sendResponse(res, 200, {
        data: categories,
        message: "Categories fetched successfully",
      });
    }
  );

  getCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: categoryId } = req.params;
      const category = await this.categoryService.getCategory(categoryId);
      sendResponse(res, 200, {
        data: category,
        message: "Category fetched successfully",
      });
    }
  );

  createCategory = asyncHandler(
    async (
      req: Request<any, any, CreateCategoryDto>,
      res: Response
    ): Promise<void> => {
      const { name } = req.body;
      const { category } = await this.categoryService.createCategory(name);
      sendResponse(res, 201, {
        data: category,
        message: "Category created successfully",
      });
    }
  );

  deleteCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: categoryId } = req.params;
      await this.categoryService.deleteCategory(categoryId);
      sendResponse(res, 204, { message: "Category deleted successfully" });
    }
  );
}
