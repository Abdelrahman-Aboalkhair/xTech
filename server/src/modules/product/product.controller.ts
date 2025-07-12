import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ProductService } from "./product.service";
import slugify from "@/shared/utils/slugify";
import { makeLogsService } from "../logs/logs.factory";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";
import AppError from "@/shared/errors/AppError";

export class ProductController {
  private logsService = makeLogsService();
  constructor(private productService: ProductService) {}

  getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { products, totalResults, totalPages, currentPage, resultsPerPage } =
      await this.productService.getAllProducts(req.query);
    sendResponse(res, 200, {
      data: { products, totalResults, totalPages, currentPage, resultsPerPage },
      message: "Products fetched successfully",
    });
  });

  getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;
    const product = await this.productService.getProductById(productId);
    sendResponse(res, 200, {
      data: product,
      message: "Product fetched successfully",
    });
  });

  getProductBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug: productSlug } = req.params;
    const product = await this.productService.getProductBySlug(productSlug);
    sendResponse(res, 200, {
      data: product,
      message: "Product fetched successfully",
    });
  });

  createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      description,
      categoryId,
      isNew,
      isFeatured,
      isTrending,
      isBestSeller,
      variants,
    } = req.body;

    // Validate variants
    let parsedVariants = variants;
    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (error) {
        throw new AppError(400, "Invalid variants format: must be valid JSON");
      }
    }
    if (!Array.isArray(parsedVariants)) {
      throw new AppError(400, "Variants must be an array");
    }
    parsedVariants.forEach((variant: any, index: number) => {
      if (!variant.sku || typeof variant.price !== "number" || typeof variant.stock !== "number") {
        throw new AppError(400, `Variant at index ${index} must have sku, price, and stock`);
      }
      if (!variant.attributes || !Array.isArray(variant.attributes)) {
        throw new AppError(400, `Variant at index ${index} must have an attributes array`);
      }
      if (variant.stock < 0) {
        throw new AppError(400, `Variant at index ${index} must have a non-negative stock number`);
      }
      variant.attributes.forEach((attr: any, attrIndex: number) => {
        if (!attr.attributeId || !attr.valueId) {
          throw new AppError(400, `Invalid attribute structure in variant at index ${index}, attribute index ${attrIndex}`);
        }
      });
      const attributeIds = variant.attributes.map((attr: any) => attr.attributeId);
      if (new Set(attributeIds).size !== attributeIds.length) {
        throw new AppError(400, `Duplicate attributes in variant at index ${index}`);
      }
    });
    const skuKeys = parsedVariants.map((variant: any) => variant.sku);
    if (new Set(skuKeys).size !== skuKeys.length) {
      throw new AppError(400, "Duplicate SKUs detected in request");
    }
    const comboKeys = parsedVariants.map((variant: any) =>
      variant.attributes.map((attr: any) => `${attr.attributeId}:${attr.valueId}`).sort().join("|")
    );
    if (new Set(comboKeys).size !== comboKeys.length) {
      throw new AppError(400, "Duplicate attribute combinations detected");
    }

    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
    }

    const product = await this.productService.createProduct({
      name,
      description,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      isNew: isNew ?? false,
      isTrending: isTrending ?? false,
      isBestSeller: isBestSeller ?? false,
      isFeatured: isFeatured ?? false,
      categoryId,
      variants: parsedVariants,
    });

    sendResponse(res, 201, {
      data: { product },
      message: "Product created successfully",
    });
    this.logsService.info("Product created", {
      userId: req.user?.id,
      sessionId: req.session?.id,
      timePeriod: 0,
    });
  });

  updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;
    const {
      name,
      description,
      basePrice,
      discount,
      categoryId,
      isNew,
      isFeatured,
      isTrending,
      isBestSeller,
      variants,
    } = req.body;

    // Validate variants
    let parsedVariants;
    if (variants) {
      try {
        parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
        if (!Array.isArray(parsedVariants)) {
          throw new AppError(400, "Variants must be an array");
        }
        parsedVariants.forEach((variant: any, index: number) => {
          if (!variant.sku || typeof variant.price !== "number" || typeof variant.stock !== "number") {
            throw new AppError(400, `Variant at index ${index} must have sku, price, and stock`);
          }
          if (!variant.attributes || !Array.isArray(variant.attributes)) {
            throw new AppError(400, `Variant at index ${index} must have an attributes array`);
          }
          if (typeof variant.stock !== "number" || variant.stock < 0) {
            throw new AppError(400, `Variant at index ${index} must have a valid non-negative stock number`);
          }
          variant.attributes.forEach((attr: any) => {
            if (!attr.attributeId || !attr.valueId) {
              throw new AppError(400, `Invalid attribute structure in variant at index ${index}`);
            }
          });
          // Check for duplicate attributes in the same variant
          const attributeIds = variant.attributes.map((attr: any) => attr.attributeId);
          if (new Set(attributeIds).size !== attributeIds.length) {
            throw new AppError(400, `Duplicate attributes in variant at index ${index}`);
          }
        });
        // Check for duplicate SKUs
        const skuKeys = parsedVariants.map((variant: any) => variant.sku);
        if (new Set(skuKeys).size !== skuKeys.length) {
          throw new AppError(400, "Duplicate SKUs detected");
        }
        // Check for duplicate attribute combinations
        const comboKeys = parsedVariants.map((variant: any) =>
          variant.attributes.map((attr: any) => `${attr.attributeId}:${attr.valueId}`).sort().join("|")
        );
        if (new Set(comboKeys).size !== comboKeys.length) {
          throw new AppError(400, "Duplicate attribute combinations detected");
        }
      } catch (error) {
        throw new AppError(400, "Invalid variants format");
      }
    }

    const formattedIsNew = isNew === "true";
    const formattedIsFeatured = isFeatured === "true";
    const formattedIsTrending = isTrending === "true";
    const formattedIsBestSeller = isBestSeller === "true";
    const formattedBasePrice = basePrice !== undefined ? Number(basePrice) : undefined;
    const formattedDiscount = discount !== undefined ? Number(discount) : undefined;

    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
    }

    const updatedData: any = {
      ...(name && { name, slug: slugify(name) }),
      ...(description && { description }),
      ...(formattedBasePrice !== undefined && { basePrice: formattedBasePrice }),
      ...(formattedDiscount !== undefined && { discount: formattedDiscount }),
      ...(imageUrls.length > 0 && { images: imageUrls }),
      ...(formattedIsNew !== undefined && { isNew: formattedIsNew }),
      ...(formattedIsFeatured !== undefined && { isFeatured: formattedIsFeatured }),
      ...(formattedIsTrending !== undefined && { isTrending: formattedIsTrending }),
      ...(formattedIsBestSeller !== undefined && { isBestSeller: formattedIsBestSeller }),
      ...(categoryId && { categoryId }),
      ...(parsedVariants && { variants: parsedVariants }),
    };

    const product = await this.productService.updateProduct(productId, updatedData);

    sendResponse(res, 200, {
      data: { product },
      message: "Product updated successfully",
    });
    this.logsService.info("Product updated", {
      userId: req.user?.id,
      sessionId: req.session.id,
    });
  });

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

  deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;
    await this.productService.deleteProduct(productId);
    sendResponse(res, 200, { message: "Product deleted successfully" });
    const start = Date.now();
    const end = Date.now();

    this.logsService.info("Product deleted", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: end - start,
    });
  });
}