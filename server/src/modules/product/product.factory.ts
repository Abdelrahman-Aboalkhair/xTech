import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

export const makeProductController = () => {
  const repository = new ProductRepository();
  const service = new ProductService(repository);
  return new ProductController(service);
};