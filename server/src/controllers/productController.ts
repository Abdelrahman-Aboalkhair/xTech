import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import ProductService from "../services/productService";
import slugify from "../utils/slugify";

class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getAllProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        products,
        totalResults,
        totalPages,
        currentPage,
        resultsPerPage,
      } = await this.productService.getAllProducts(req.query);
      sendResponse(
        res,
        200,
        {
          products,
          totalResults,
          totalPages,
          currentPage,
          resultsPerPage,
        },
        "Products fetched successfully"
      );
    }
  );

  getProductById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const product = await this.productService.getProductById(productId);
      sendResponse(res, 200, { product }, "Product fetched successfully");
    }
  );

  getProductBySlug = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { slug: productSlug } = req.params;
      const product = await this.productService.getProductBySlug(productSlug);
      sendResponse(res, 200, { product }, "Product fetched successfully");
    }
  );

  createProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, description, price, discount, images, stock, categoryId } =
        req.body;
      const slugifiedName = slugify(name);

      const { product } = await this.productService.createProduct({
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
    }
  );

  updateProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const updatedData = req.body;

      const product = await this.productService.updateProduct(
        productId,
        updatedData
      );
      sendResponse(res, 200, { product }, "Product updated successfully");
    }
  );

  deleteProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      await this.productService.deleteProduct(productId);
      sendResponse(res, 200, {}, "Product deleted successfully");
    }
  );
}

export default new ProductController(new ProductService());
