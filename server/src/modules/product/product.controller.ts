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
  constructor(private productService: ProductService) { }

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

  createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      description,
      price,
      discount,
      categoryId,
      sku,
      isNew,
      isFeatured,
      isTrending,
      isBestSeller,
      attributeCombinations,
    } = req.body;

    // Validate attributeCombinations
    let parsedAttributeCombinations;
    if (attributeCombinations) {
      try {
        parsedAttributeCombinations = typeof attributeCombinations === 'string' ? JSON.parse(attributeCombinations) : attributeCombinations;
        if (!Array.isArray(parsedAttributeCombinations)) {
          throw new AppError(400, 'attributeCombinations must be an array');
        }
        parsedAttributeCombinations.forEach((combo: any, index: number) => {
          if (!combo.attributes || !Array.isArray(combo.attributes)) {
            throw new AppError(400, `Combination at index ${index} must have an attributes array`);
          }
          if (typeof combo.stock !== 'number' || combo.stock < 0) {
            throw new AppError(400, `Combination at index ${index} must have a valid non-negative stock number`);
          }
          combo.attributes.forEach((attr: any) => {
            if (!attr.attributeId || !attr.valueId) {
              throw new AppError(400, `Invalid attribute structure in combination at index ${index}`);
            }
          });
          // Check for duplicate attributes in the same combination
          const attributeIds = combo.attributes.map((attr: any) => attr.attributeId);
          if (new Set(attributeIds).size !== attributeIds.length) {
            throw new AppError(400, `Duplicate attributes in combination at index ${index}`);
          }
        });
        // Check for duplicate combinations
        const comboKeys = parsedAttributeCombinations.map((combo: any) =>
          combo.attributes.map((attr: any) => `${attr.attributeId}:${attr.valueId}`).sort().join('|')
        );
        if (new Set(comboKeys).size !== comboKeys.length) {
          throw new AppError(400, 'Duplicate attribute combinations detected');
        }
      } catch (error) {
        throw new AppError(400, 'Invalid attributeCombinations format');
      }
    } else {
      throw new AppError(400, 'attributeCombinations are required');
    }

    const formattedIsNew = isNew === 'true';
    const formattedIsFeatured = isFeatured === 'true';
    const formattedIsTrending = isTrending === 'true';
    const formattedIsBestSeller = isBestSeller === 'true';
    const formattedPrice = Number(price);
    const formattedDiscount = Number(discount);

    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
    }

    const { product } = await this.productService.createProduct({
      name,
      sku,
      isNew: formattedIsNew,
      isTrending: formattedIsTrending,
      isBestSeller: formattedIsBestSeller,
      isFeatured: formattedIsFeatured,
      slug: slugify(name),
      description,
      price: formattedPrice,
      discount: formattedDiscount,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      categoryId,
      attributeCombinations: parsedAttributeCombinations,
    });

    sendResponse(res, 201, {
      data: { product },
      message: 'Product created successfully',
    });
    this.logsService.info('Product created', {
      userId: req.user?.id,
      sessionId: req.session.id,
    });
  });

  updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;
    const {
      name,
      description,
      price,
      discount,
      categoryId,
      sku,
      isNew,
      isFeatured,
      isTrending,
      isBestSeller,
      attributeCombinations,
    } = req.body;

    // Validate attributeCombinations
    let parsedAttributeCombinations;
    if (attributeCombinations) {
      try {
        parsedAttributeCombinations = typeof attributeCombinations === 'string' ? JSON.parse(attributeCombinations) : attributeCombinations;
        if (!Array.isArray(parsedAttributeCombinations)) {
          throw new AppError(400, 'attributeCombinations must be an array');
        }
        parsedAttributeCombinations.forEach((combo: any, index: number) => {
          if (!combo.attributes || !Array.isArray(combo.attributes)) {
            throw new AppError(400, `Combination at index ${index} must have an attributes array`);
          }
          if (typeof combo.stock !== 'number' || combo.stock < 0) {
            throw new AppError(400, `Combination at index ${index} must have a valid non-negative stock number`);
          }
          combo.attributes.forEach((attr: any) => {
            if (!attr.attributeId || !attr.valueId) {
              throw new AppError(400, `Invalid attribute structure in combination at index ${index}`);
            }
          });
          // Check for duplicate attributes in the same combination
          const attributeIds = combo.attributes.map((attr: any) => attr.attributeId);
          if (new Set(attributeIds).size !== attributeIds.length) {
            throw new AppError(400, `Duplicate attributes in combination at index ${index}`);
          }
        });
        // Check for duplicate combinations
        const comboKeys = parsedAttributeCombinations.map((combo: any) =>
          combo.attributes.map((attr: any) => `${attr.attributeId}:${attr.valueId}`).sort().join('|')
        );
        if (new Set(comboKeys).size !== comboKeys.length) {
          throw new AppError(400, 'Duplicate attribute combinations detected');
        }
      } catch (error) {
        throw new AppError(400, 'Invalid attributeCombinations format');
      }
    }

    const formattedIsNew = isNew === 'true';
    const formattedIsFeatured = isFeatured === 'true';
    const formattedIsTrending = isTrending === 'true';
    const formattedIsBestSeller = isBestSeller === 'true';
    const formattedPrice = price !== undefined ? Number(price) : undefined;
    const formattedDiscount = discount !== undefined ? Number(discount) : undefined;

    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
    }

    const updatedData: any = {
      ...(name && { name, slug: slugify(name) }),
      ...(sku && { sku }),
      ...(formattedIsNew !== undefined && { isNew: formattedIsNew }),
      ...(formattedIsFeatured !== undefined && { isFeatured: formattedIsFeatured }),
      ...(formattedIsTrending !== undefined && { isTrending: formattedIsTrending }),
      ...(formattedIsBestSeller !== undefined && { isBestSeller: formattedIsBestSeller }),
      ...(description && { description }),
      ...(formattedPrice !== undefined && { price: formattedPrice }),
      ...(formattedDiscount !== undefined && { discount: formattedDiscount }),
      ...(imageUrls.length > 0 && { images: imageUrls }),
      ...(categoryId && { categoryId }),
      ...(parsedAttributeCombinations && { attributeCombinations: parsedAttributeCombinations }),
    };

    const product = await this.productService.updateProduct(productId, updatedData);

    sendResponse(res, 200, {
      data: { product },
      message: 'Product updated successfully',
    });
    this.logsService.info('Product updated', {
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
