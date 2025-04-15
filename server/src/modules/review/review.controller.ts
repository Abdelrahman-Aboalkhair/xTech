// src/controllers/review.controller.ts
import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ReviewService } from "./review.service";

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  createReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { productId, rating, comment } = req.body;

    const review = await this.reviewService.createReview(userId, {
      productId,
      rating,
      comment,
    });

    sendResponse(res, 201, {
      data: review,
      message: "Review created successfully",
    });
  });

  getReviewsByProductId = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { page, limit } = req.query;

    const result = await this.reviewService.getReviewsByProductId(productId, {
      page: Number(page),
      limit: Number(limit),
    });

    sendResponse(res, 200, {
      data: result,
      message: "Reviews fetched successfully",
    });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await this.reviewService.deleteReview(id, userId);

    sendResponse(res, 200, result);
  });
}
