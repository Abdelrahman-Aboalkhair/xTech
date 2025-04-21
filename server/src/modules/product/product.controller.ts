import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ProductService } from "./product.service";
import slugify from "@/shared/utils/slugify";
import { makeLogsService } from "../logs/logs.factory";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";

export class ProductController {
  private logsService = makeLogsService();
  constructor(private productService: ProductService) {}

  getAllProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        products,
        totalResults,
        totalPages,
        currentPage,
        resultsPerPage,
      } = await this.productService.getAllProducts(req.query);
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
    }
  );

  getProductById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const product = await this.productService.getProductById(productId);
      sendResponse(res, 200, {
        data: product,
        message: "Product fetched successfully",
      });
    }
  );

  getProductBySlug = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { slug: productSlug } = req.params;
      const product = await this.productService.getProductBySlug(productSlug);
      sendResponse(res, 200, {
        data: product,
        message: "Product fetched successfully",
      });
    }
  );

  createProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, description, price, discount, stock, categoryId } =
        req.body;
      const slugifiedName = slugify(name);
      const files = req.files as Express.Multer.File[];

      const formattedPrice = Number(price);
      const formattedDiscount = Number(discount);
      const formattedStock = Number(stock);

      let imageUrls: string[] = [];
      if (Array.isArray(files) && files.length > 0) {
        const uploadedImages = await uploadToCloudinary(files);
        imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
      }

      const { product } = await this.productService.createProduct({
        name,
        slug: slugifiedName,
        description,
        price: formattedPrice,
        discount: formattedDiscount,
        stock: formattedStock,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        categoryId,
      });

      sendResponse(res, 201, {
        data: product,
        message: "Product created successfully",
      });
      const start = Date.now();
      const end = Date.now();

      this.logsService.info("Product created", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );

  bulkCreateProducts = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    const result = await this.productService.bulkCreateProducts(file!);

    sendResponse(res, 201, {
      data: { count: result.count },
      message: `${result.count} products created successfully`,
    });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Bulk Products created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });

  updateProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const updatedData = req.body;

      const product = await this.productService.updateProduct(
        productId,
        updatedData
      );
      sendResponse(res, 200, {
        data: product,
        message: "Product updated successfully",
      });
      const start = Date.now();
      const end = Date.now();

      this.logsService.info("Product updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );

  deleteProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      console.log("productId: ", productId);
      await this.productService.deleteProduct(productId);
      sendResponse(res, 200, { message: "Product deleted successfully" });
      const start = Date.now();
      const end = Date.now();

      this.logsService.info("Product deleted", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );
}
