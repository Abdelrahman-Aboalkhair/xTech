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

  createProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        name,
        description,
        price,
        discount,
        stock,
        categoryId,
        sku,
        isNew,
        isFeatured,
        isTrending,
        isBestSeller,
        attributes,
      } = req.body;


      let parsedAttributes;
      if (attributes) {
        try {
          parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
          // Validate attributes structure
          if (!Array.isArray(parsedAttributes)) {
            throw new AppError(400, "Attributes must be an array");
          }
          parsedAttributes.forEach((attr: any) => {
            if (!attr.attributeId || (!attr.valueId && !attr.valueIds && !attr.customValue)) {
              throw new AppError(400, "Invalid attribute structure");
            }
            if (attr.valueIds && !Array.isArray(attr.valueIds)) {
              throw new AppError(400, "valueIds must be an array");
            }
          });
        } catch (error) {
          throw new AppError(400, "Invalid attributes format");
        }
      }

      console.log('parsedAttributes => ', parsedAttributes);


      const slugifiedName = slugify(name);
      const formattedIsNew = isNew === "true";
      const formattedIsFeatured = isFeatured === "true";
      const formattedIsTrending = isTrending === "true";
      const formattedIsBestSeller = isBestSeller === "true";
      const formattedPrice = Number(price);
      const formattedDiscount = Number(discount);
      const formattedStock = Number(stock);

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
        isFeatured: formattedIsFeatured,
        isTrending: formattedIsTrending,
        isBestSeller: formattedIsBestSeller,
        slug: slugifiedName,
        description,
        price: formattedPrice,
        discount: formattedDiscount,
        stock: formattedStock,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        categoryId,
        attributes: parsedAttributes,
      });

      sendResponse(res, 201, {
        data: { product },
        message: "Product created successfully",
      });
      this.logsService.info("Product created", {
        userId: req.user?.id,
        sessionId: req.session.id,
      });
    }
  );

  // In updateProduct
  updateProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const {
        name,
        description,
        price,
        discount,
        stock,
        categoryId,
        sku,
        isNew,
        isFeatured,
        isTrending,
        isBestSeller,
        attributes, // New field
      } = req.body;

      const files = req.files as Express.Multer.File[];
      const formattedIsNew = isNew === "true";
      const formattedIsFeatured = isFeatured === "true";
      const formattedIsTrending = isTrending === "true";
      const formattedIsBestSeller = isBestSeller === "true";

      const formattedPrice = price !== undefined ? Number(price) : undefined;
      const formattedDiscount =
        discount !== undefined ? Number(discount) : undefined;
      const formattedStock = stock !== undefined ? Number(stock) : undefined;

      let imageUrls: string[] = [];
      if (Array.isArray(files) && files.length > 0) {
        const uploadedImages = await uploadToCloudinary(files);
        imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
      }

      const updatedData: any = {
        ...(name && { name, slug: slugify(name) }),
        ...(sku && { sku }),
        ...(formattedIsNew !== undefined && { isNew: formattedIsNew }),
        ...(formattedIsFeatured !== undefined && {
          isFeatured: formattedIsFeatured,
        }),
        ...(formattedIsTrending !== undefined && {
          isTrending: formattedIsTrending,
        }),
        ...(formattedIsBestSeller !== undefined && {
          isBestSeller: formattedIsBestSeller,
        }),
        ...(description && { description }),
        ...(formattedPrice !== undefined && { price: formattedPrice }),
        ...(formattedDiscount !== undefined && { discount: formattedDiscount }),
        ...(formattedStock !== undefined && { stock: formattedStock }),
        ...(imageUrls.length > 0 && { images: imageUrls }),
        ...(categoryId && { categoryId }),
        ...(attributes && { attributes }), // Pass attributes
      };

      const product = await this.productService.updateProduct(
        productId,
        updatedData
      );

      sendResponse(res, 200, {
        data: { product },
        message: "Product updated successfully",
      });
      this.logsService.info("Product updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
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
