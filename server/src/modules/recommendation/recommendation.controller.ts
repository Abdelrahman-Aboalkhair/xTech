import { Request, Response } from "express";
import { RecommendationService } from "./recommendation.service";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";

export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  getRecommendations = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { numRecommendations } = req.query;

    const recommendations = await this.recommendationService.getRecommendations(
      productId,
      Number(numRecommendations) || 5
    );

    sendResponse(res, 200, {
      data: recommendations,
      message: "Recommendations fetched successfully",
    });
  });
}
