// server/src/modules/product/product.service.ts
import AppError from "@/shared/errors/AppError";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { ProductRepository } from "./product.repository";
import slugify from "@/shared/utils/slugify";
import prisma from "@/infra/database/database.config";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(queryString: Record<string, any>) {
    const apiFeatures = new ApiFeatures(queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    const { where, orderBy, skip, take, select } = apiFeatures;

    const finalWhere = where && Object.keys(where).length > 0 ? where : {};

    const totalResults = await this.productRepository.countProducts({
      where: finalWhere,
    });

    const totalPages = Math.ceil(totalResults / take);
    const currentPage = Math.floor(skip / take) + 1;

    const products = await this.productRepository.findManyProducts({
      where: finalWhere,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
      select,
    });

    return {
      products,
      totalResults,
      totalPages,
      currentPage,
      resultsPerPage: take,
    };
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  async getProductBySlug(productSlug: string) {
    const product = await this.productRepository.findProductBySlug(productSlug);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  async createProduct(
    data: {
      name: string;
      price: number;
      description?: string;
      categoryId?: string;
    },
    files: Express.Multer.File[] = []
  ) {
    if (await this.productRepository.findProductByName(data.name)) {
      throw new AppError(400, "Product name already exists");
    }

    let images: string[] = [];
    let videoUrl: string | undefined;

    if (files.length > 0) {
      const imageFiles = files.filter((file) =>
        file.mimetype.startsWith("image")
      );
      const videoFiles = files.filter((file) =>
        file.mimetype.startsWith("video")
      );

      if (imageFiles.length > 0) {
        const imageResults = await uploadToCloudinary(imageFiles);
        images = imageResults.map((img) => img.url);
      }

      if (videoFiles.length > 0) {
        if (videoFiles.length > 1) {
          throw new AppError(400, "Only one video can be uploaded per product");
        }
        const videoResult = await uploadToCloudinary(videoFiles, "video");
        videoUrl = videoResult[0]?.url;
      }
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError(404, "Category not found");
      }
    }

    return this.productRepository.createProduct({
      ...data,
      slug: slugify(data.name),
      images,
      videoUrl,
    });
  }

  async updateProduct(
    productId: string,
    data: Partial<{
      name: string;
      price: number;
      description?: string;
      categoryId?: string;
      images?: string[];
      videoUrl?: string;
    }>,
    files: Express.Multer.File[] = []
  ) {
    const existingProduct = await this.productRepository.findProductById(
      productId
    );
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }

    if (data.name && data.name !== existingProduct.name) {
      if (await this.productRepository.findProductByName(data.name)) {
        throw new AppError(400, "Product name already exists");
      }
    }

    let images = data.images || existingProduct.images;
    let videoUrl = data.videoUrl || existingProduct.videoUrl;

    if (files.length > 0) {
      const imageFiles = files.filter((file) =>
        file.mimetype.startsWith("image")
      );
      const videoFiles = files.filter((file) =>
        file.mimetype.startsWith("video")
      );

      if (imageFiles.length > 0) {
        const imageResults = await uploadToCloudinary(imageFiles);
        images = [...images, ...imageResults.map((img) => img.url)];
      }

      if (videoFiles.length > 0) {
        if (videoFiles.length > 1) {
          throw new AppError(400, "Only one video can be uploaded per product");
        }
        const videoResult = await uploadToCloudinary(videoFiles, "video");
        videoUrl = videoResult[0]?.url;
      }
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError(404, "Category not found");
      }
    }

    return this.productRepository.updateProduct(productId, {
      ...data,
      ...(data.name && { slug: slugify(data.name) }),
      images,
      videoUrl: videoUrl ?? undefined,
    });
  }

  async deleteProduct(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    await this.productRepository.deleteProduct(productId);
  }
}
