import AppError from "@/shared/errors/AppError";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { ProductRepository } from "./product.repository";
import slugify from "@/shared/utils/slugify";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import prisma from "@/infra/database/database.config";
import { AttributeRepository } from "../attribute/attribute.repository";

type ProductUpdateData = Partial<{
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  stock: number;
  categoryId?: string;
}>;

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private attributeRepository: AttributeRepository
  ) { }
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
    sku: string;
    isNew: boolean;
    isTrending: boolean;
    isBestSeller: boolean;
    isFeatured: boolean;
    slug: string;
    description?: string;
    price: number;
    discount: number;
    images?: string[];
    categoryId?: string;
    attributeCombinations: {
      attributes: { attributeId: string; valueId: string }[];
      stock: number;
    }[];
  }) {
    // Let the combos be: (Black/Small/Cotton, White/Small/Cotton, White/Medium/Polyester).
    const { attributeCombinations, ...productData } = data;

    // Validate attributeCombinations
    if (!attributeCombinations || attributeCombinations.length === 0) {
      throw new AppError(400, 'At least one attribute combination is required');
    }

    // Ensures each combination includes all required attributes for the product’s category (e.g., Size, Material, Color for Clothing).
    if (productData.categoryId) {
      const requiredAttributes = await prisma.categoryAttribute.findMany({
        where: { categoryId: productData.categoryId, isRequired: true },
        select: { attributeId: true },
      });
      const requiredAttributeIds = requiredAttributes.map((attr) => attr.attributeId);

      attributeCombinations.forEach((combo, index) => {
        const comboAttributeIds = combo.attributes.map((attr) => attr.attributeId);
        const missingAttributes = requiredAttributeIds.filter(
          (id) => !comboAttributeIds.includes(id)
        );
        if (missingAttributes.length > 0) {
          throw new AppError(
            400,
            `Combination at index ${index} is missing required attributes: ${missingAttributes.join(', ')}`
          );
        }
      });
    }

    // Ensures all attributeIds in the combinations exist in the Attribute table.
    // ? Flattens the nested attributeCombinations and attributes arrays into a list of attributeIds.
    const allAttributeIds = [...new Set(attributeCombinations.flatMap((c) => c.attributes.map((a) => a.attributeId)))];
    const existingAttributes = await prisma.attribute.findMany({
      where: { id: { in: allAttributeIds } },
    });
    if (existingAttributes.length !== allAttributeIds.length) {
      throw new AppError(400, 'One or more attributes are invalid');
    }

    const allValueIds = [...new Set(attributeCombinations.flatMap((c) => c.attributes.map((a) => a.valueId)))];
    const existingValues = await prisma.attributeValue.findMany({
      where: { id: { in: allValueIds } },
    });
    if (existingValues.length !== allValueIds.length) {
      throw new AppError(400, 'One or more attribute values are invalid');
    }

    /* Aggregates stock for each attribute-value pair 
    (e.g., Color: Black) across all combinations, as 
    ProductAttribute stores stock per attribute value, not per combination. */

    /* 
    
    Combinations:
Black/Small/Cotton: stock: 3
White/Small/Cotton: stock: 1
White/Medium/Polyester: stock: 1

    {
  "ad0a8b6f-6a56-434f-a514-400515a72154:280068ea-cd02-410b-9020-2dc650f4ba10": 3, // Color: Black
  "eda5945f-012c-498a-a9e9-d537d1e871ab:c1299294-12fd-47f6-90c5-a60df0f925fa": 4, // Size: Small (3 + 1)
  "e5a73400-7705-4065-b5a3-16c60176cfcb:5e4b8d2c-05d8-4da7-8804-d406bbd1e86c": 4, // Material: Cotton (3 + 1)
  "ad0a8b6f-6a56-434f-a514-400515a72154:9362b1f4-64ac-43e0-95f8-d27ac6c36dd0": 2, // Color: White (1 + 1)
  "eda5945f-012c-498a-a9e9-d537d1e871ab:66842bf5-25bf-4ac2-9ca1-edcdd3ac4483": 1, // Size: Medium
  "e5a73400-7705-4065-b5a3-16c60176cfcb:f4f3cafd-6ff8-4404-b447-f713f45d32bb": 1 // Material: Polyester
}
  
    */
    const attributeStockMap: { [key: string]: number } = {}; // {attributeId:valueId:stock}
    attributeCombinations.forEach((combo) => {
      combo.attributes.forEach((attr) => {
        const key = `${attr.attributeId}:${attr.valueId}`; // e.g. Color: Black
        attributeStockMap[key] = (attributeStockMap[key] || 0) + combo.stock;
      });
    });

    // Calculate total stock
    const totalStock = attributeCombinations.reduce((sum, combo) => sum + combo.stock, 0);

    // Prepare ProductAttribute data
    const productAttributes = Object.entries(attributeStockMap).map(([key, stock]) => {
      const [attributeId, valueId] = key.split(':');
      return { attributeId, valueId, stock };
    });

    // Create product
    const product = await this.productRepository.createProduct({
      ...productData,
      stock: totalStock,
      attributes: productAttributes,
    });

    // Fetch product with attributes
    const productWithAttributes = await this.productRepository.findProductById(product.id);
    return { product: productWithAttributes };
  }

  async updateProduct(
    productId: string,
    updatedData: Partial<{
      name: string;
      sku: string;
      isNew: boolean;
      isTrending: boolean;
      isBestSeller: boolean;
      isFeatured: boolean;
      slug: string;
      description?: string;
      price: number;
      discount: number;
      images?: string[];
      categoryId?: string;
      attributeCombinations: {
        attributes: { attributeId: string; valueId: string }[];
        stock: number;
      }[];
    }>
  ) {
    const existingProduct = await this.productRepository.findProductById(productId);
    if (!existingProduct) {
      throw new AppError(404, 'Product not found');
    }

    const { attributeCombinations, ...productData } = updatedData;

    // Default to existing stock if no attributeCombinations provided
    let totalStock = existingProduct.stock;
    let productAttributes;

    if (attributeCombinations) {
      if (attributeCombinations.length === 0) {
        throw new AppError(400, 'At least one attribute combination is required');
      }

      // Validate category requirements
      const categoryId = productData.categoryId || existingProduct.categoryId;
      if (categoryId) {
        const requiredAttributes = await prisma.categoryAttribute.findMany({
          where: { categoryId, isRequired: true },
          select: { attributeId: true },
        });
        const requiredAttributeIds = requiredAttributes.map((attr) => attr.attributeId);

        attributeCombinations.forEach((combo, index) => {
          const comboAttributeIds = combo.attributes.map((attr) => attr.attributeId);
          const missingAttributes = requiredAttributeIds.filter(
            (id) => !comboAttributeIds.includes(id)
          );
          if (missingAttributes.length > 0) {
            throw new AppError(
              400,
              `Combination at index ${index} is missing required attributes: ${missingAttributes.join(', ')}`
            );
          }
        });
      }

      // Validate attributes and values
      const allAttributeIds = [...new Set(attributeCombinations.flatMap((c) => c.attributes.map((a) => a.attributeId)))];
      const existingAttributes = await prisma.attribute.findMany({
        where: { id: { in: allAttributeIds } },
      });
      if (existingAttributes.length !== allAttributeIds.length) {
        throw new AppError(400, 'One or more attributes are invalid');
      }

      const allValueIds = [...new Set(attributeCombinations.flatMap((c) => c.attributes.map((a) => a.valueId)))];
      const existingValues = await prisma.attributeValue.findMany({
        where: { id: { in: allValueIds } },
      });
      if (existingValues.length !== allValueIds.length) {
        throw new AppError(400, 'One or more attribute values are invalid');
      }

      // Aggregate stock for ProductAttribute records
      const attributeStockMap: { [key: string]: number } = {};
      attributeCombinations.forEach((combo) => {
        combo.attributes.forEach((attr) => {
          const key = `${attr.attributeId}:${attr.valueId}`;
          attributeStockMap[key] = (attributeStockMap[key] || 0) + combo.stock;
        });
      });

      // Calculate total stock
      totalStock = attributeCombinations.reduce((sum, combo) => sum + combo.stock, 0);

      // Prepare ProductAttribute data
      productAttributes = Object.entries(attributeStockMap).map(([key, stock]) => {
        const [attributeId, valueId] = key.split(':');
        return { attributeId, valueId, stock };
      });

      // Delete existing ProductAttribute records
      await prisma.productAttribute.deleteMany({ where: { productId } });
    }

    // Update product
    const product = await this.productRepository.updateProduct(productId, {
      ...productData,
      stock: totalStock,
      attributes: productAttributes,
    });

    // Fetch updated product with attributes
    return await this.productRepository.findProductById(productId);
  }

  async restockProduct(
    productId: string,
    quantity: number,
    notes?: string,
    userId?: string
  ) {
    if (quantity <= 0) {
      throw new AppError(400, "Quantity must be positive");
    }

    return prisma.$transaction(async (tx) => {
      // Create restock record
      const restock = await this.productRepository.createRestock({
        productId,
        quantity,
        notes,
        userId,
      });

      // Update product stock
      await this.productRepository.updateProductStock(productId, quantity);

      // Log stock movement
      await this.productRepository.createStockMovement({
        productId,
        quantity,
        reason: "restock",
        userId,
      });

      return restock;
    });
  }

  async bulkCreateProducts(file: Express.Multer.File) {
    if (!file) {
      throw new AppError(400, "No file uploaded");
    }

    let records: any[];
    try {
      if (file.mimetype === "text/csv") {
        records = parse(file.buffer.toString(), {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        records = XLSX.utils.sheet_to_json(sheet);
      } else {
        throw new AppError(400, "Unsupported file format. Use CSV or XLSX");
      }
    } catch (error) {
      throw new AppError(400, "Failed to parse file");
    }

    if (records.length === 0) {
      throw new AppError(400, "File is empty");
    }
    console.log("RECORDS => ", records);

    // Validate and transform records
    const products = records.map((record) => {
      if (!record.name || !record.price || !record.stock) {
        throw new AppError(400, `Invalid record: ${JSON.stringify(record)}`);
      }

      return {
        name: String(record.name),
        slug: slugify(record.name),
        description: record.description
          ? String(record.description)
          : undefined,
        price: Number(record.price),
        discount: record.discount ? Number(record.discount) : 0,
        images: record.images
          ? String(record.images)
            .split(",")
            .map((img: string) => img.trim())
          : [],
        stock: Number(record.stock),
        categoryId: record.categoryId ? String(record.categoryId) : undefined,
        isNew: record.isNew ? Boolean(record.isNew) : false,
        isTrending: record.isTrending ? Boolean(record.isTrending) : false,
        isBestSeller: record.isBestSeller
          ? Boolean(record.isBestSeller)
          : false,
        isFeatured: record.isFeatured ? Boolean(record.isFeatured) : false,
      };
    });

    // Validate categoryIds (if provided)
    const categoryIds = products
      .filter((p) => p.categoryId)
      .map((p) => p.categoryId!);
    if (categoryIds.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true },
      });
      const validCategoryIds = new Set(existingCategories.map((c) => c.id));
      for (const product of products) {
        if (product.categoryId && !validCategoryIds.has(product.categoryId)) {
          throw new AppError(400, `Invalid categoryId: ${product.categoryId}`);
        }
      }
    }

    // Create products
    await this.productRepository.createManyProducts(products);

    return { count: products.length };
  }

  async deleteProduct(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    await this.productRepository.deleteProduct(productId);
  }
}
