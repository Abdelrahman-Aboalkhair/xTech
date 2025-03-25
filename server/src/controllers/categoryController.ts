import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import CategoryService from "../services/categoryService";
import slugify from "../utils/slugify";

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  sendResponse(res, 200, { categories }, "Categories fetched successfully");
});

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const slugifiedName = slugify(name);

  const { category } = await CategoryService.createCategory(slugifiedName);

  sendResponse(res, 201, { category }, "Category created successfully");
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id: categoryId } = req.params;
  await CategoryService.deleteCategory(categoryId);
  sendResponse(res, 204, {}, "Category deleted successfully");
});

export { getAllCategories, createCategory, deleteCategory };
