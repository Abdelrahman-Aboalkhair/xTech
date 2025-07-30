import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ProductService } from "./product.service";
import { makeLogsService } from "../logs/logs.factory";
import AppError from "@/shared/errors/AppError";

export class ProductController {
  private logsService = makeLogsService();
  constructor(private productService: ProductService) {}

  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const { products, totalResults, totalPages, currentPage, resultsPerPage } =
      await this.productService.getAllProducts(req.query);
    sendResponse(res, 200, {
      data: {
        products,
        totalResults,
        totalPages,
        currentPage,
        resultsPerPage,
      },
      message: "Products fetched successfully",
    });
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const product = await this.productService.getProductById(productId);
    sendResponse(res, 200, {
      data: product,
      message: "Product fetched successfully",
    });
  });

  getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug: productSlug } = req.params;
    const product = await this.productService.getProductBySlug(productSlug);
    sendResponse(res, 200, {
      data: product,
      message: "Product fetched successfully",
    });
  });

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, price, description, categoryId } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];

    if (!name || !price) {
      throw new AppError(400, "Name and price are required");
    }

    const product = await this.productService.createProduct(
      { name, price: parseFloat(price), description, categoryId },
      files
    );

    sendResponse(res, 201, {
      data: { product },
      message: "Product created successfully",
    });

    this.logsService.info("Product created", {
      userId: req.user?.id,
      sessionId: req.session?.id,
    });
  });

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const { name, price, description, categoryId, images, videoUrl } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];

    const updatedData: Partial<{
      name: string;
      price: number;
      description?: string;
      categoryId?: string;
      images?: string[];
      videoUrl?: string;
    }> = {
      ...(name && { name }),
      ...(price && { price: parseFloat(price) }),
      ...(description && { description }),
      ...(categoryId && { categoryId }),
      ...(images && {
        images: Array.isArray(images) ? images : JSON.parse(images),
      }),
      ...(videoUrl && { videoUrl }),
    };

    const product = await this.productService.updateProduct(
      productId,
      updatedData,
      files
    );

    sendResponse(res, 200, {
      data: { product },
      message: "Product updated successfully",
    });

    this.logsService.info("Product updated", {
      userId: req.user?.id,
      sessionId: req.session?.id,
    });
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id: productId } = req.params;

    await this.productService.deleteProduct(productId);

    sendResponse(res, 200, { message: "Product deleted successfully" });

    this.logsService.info("Product deleted", {
      userId: req.user?.id,
      sessionId: req.session?.id,
    });
  });
}
