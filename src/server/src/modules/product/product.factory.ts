import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

export const makeProductController = () => {
  const productRepository = new ProductRepository();
  const service = new ProductService(productRepository);
  return new ProductController(service);
};
