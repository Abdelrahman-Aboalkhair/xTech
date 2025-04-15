import { ReviewRepository } from "./review.repository";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { RecommendationService } from "../recommendation/recommendation.service";

export const makeReviewController = () => {
  const repository = new ReviewRepository();
  const recommendationService = new RecommendationService();
  const service = new ReviewService(repository, recommendationService);
  return new ReviewController(service);
};
