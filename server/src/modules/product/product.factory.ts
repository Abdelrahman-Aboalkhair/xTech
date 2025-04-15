import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { RecommendationService } from "../recommendation/recommendation.service";

export const makeProductController = () => {
  const repository = new ProductRepository();
  const recommendationService = new RecommendationService();
  const service = new ProductService(repository, recommendationService);
  return new ProductController(service);
};
