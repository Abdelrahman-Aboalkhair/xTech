import prisma from "../config/database";
import AppError from "../utils/AppError";

class ProductService {
  static async getAllProducts() {
    const products = await prisma.product.findMany();
    return { products };
  }

  static async getProductById(productId: number) {
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
    description?: string;
    price: number;
    discount: number;
    images: string[];
    stock: number;
    categoryId?: number;
  }) {
    const product = await prisma.product.create({ data });
    return { product };
  }

  static async updateProduct(
    productId: number,
    updatedData: Partial<{
      name: string;
      description: string;
      price: number;
      discount: number;
      images: string[];
      stock: number;
      categoryId?: number;
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

  static async deleteProduct(productId: number) {
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
