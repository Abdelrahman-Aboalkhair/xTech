import AppError from "../utils/AppError";
import ApiFeatures from "../utils/ApiFeatures";
import ProductRepository from "../repositories/productRepository";

class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }
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

  async createProduct(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    discount: number;
    images: string[];
    stock: number;
    categoryId?: string;
  }) {
    const product = await this.productRepository.createProduct(data);
    return { product };
  }

  async updateProduct(
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
    const existingProduct = await this.productRepository.findProductById(
      productId
    );
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }

    const product = await this.productRepository.updateProduct(
      productId,
      updatedData
    );
    return product;
  }

  async deleteProduct(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    await this.productRepository.deleteProduct(productId);
  }
}

export default ProductService;
