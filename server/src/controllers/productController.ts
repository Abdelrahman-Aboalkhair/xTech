import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import ProductService from "../services/productService";
import slugify from "../utils/slugify";

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await ProductService.getAllProducts(req.query);
  sendResponse(res, 200, { products }, "Products fetched successfully");
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await ProductService.getProductById(productId);
  sendResponse(res, 200, { product }, "Product fetched successfully");
});

const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug: productSlug } = req.params;
  const product = await ProductService.getProductBySlug(productSlug);
  sendResponse(res, 200, { product }, "Product fetched successfully");
});

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, discount, images, stock, categoryId } =
    req.body;
  const slugifiedName = slugify(name);

  const { product } = await ProductService.createProduct({
    name,
    slug: slugifiedName,
    description,
    price,
    discount,
    images,
    stock,
    categoryId,
  });

  sendResponse(res, 201, { product }, "Product created successfully");
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const updatedData = req.body;

  const product = await ProductService.updateProduct(productId, updatedData);
  sendResponse(res, 200, { product }, "Product updated successfully");
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  await ProductService.deleteProduct(productId);
  sendResponse(res, 200, {}, "Product deleted successfully");
});

export {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
