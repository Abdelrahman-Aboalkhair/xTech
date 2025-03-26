import prisma from "../config/database";
import AppError from "../utils/AppError";
import ApiFeatures from "../utils/ApiFeatures";

class ProductService {
  static async getAllProducts(queryString: Record<string, any>) {
    const apiFeatures = new ApiFeatures(queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    const { where, orderBy, skip, take } = apiFeatures;

    return await prisma.product.findMany({
      where,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
    });
  }

  static async getProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    return product;
  }

  static async createProduct(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    discount: number;
    images: string[];
    stock: number;
    categoryId?: string;
  }) {
    const product = await prisma.product.create({ data });
    return { product };
  }

  static async updateProduct(
    productId: string,
    updatedData: Partial<{
      name: string;
      description: string;
      price: number;
      discount: number;
      images: string[];
      stock: number;
      categoryId?: string;
    }>
  ) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updatedData,
    });

    return product;
  }

  static async deleteProduct(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    await prisma.product.delete({ where: { id: productId } });
  }
}

export default ProductService;
