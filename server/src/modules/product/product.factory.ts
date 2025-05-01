import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { AttributeRepository } from "../attribute/attribute.repository";

export const makeProductController = () => {
  const productRepository = new ProductRepository();
  const attrRepository = new AttributeRepository();
  const service = new ProductService(productRepository, attrRepository);
  return new ProductController(service);
};
