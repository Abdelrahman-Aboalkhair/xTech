import { RecommendationController } from "./recommendation.controller";
import { RecommendationService } from "./recommendation.service";

export const makeRecommendationController = () => {
  const service = new RecommendationService();
  return new RecommendationController(service);
};
