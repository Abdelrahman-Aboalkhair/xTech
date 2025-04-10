import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AppError from "../utils/AppError";
import TrackingDetailService from "../services/trackingDetailService";

class TrackingDetailController {
  constructor(private trackingService: TrackingDetailService) {}

  // Get all tracking details for the authenticated user
  getUserTracking = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // From protect middleware
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const tracking = await this.trackingService.getUserTracking(userId);
    sendResponse(
      res,
      200,
      { tracking },
      "Tracking details retrieved successfully"
    );
  });

  // Get all tracking details (admin only)
  getAllTracking = asyncHandler(async (req: Request, res: Response) => {
    const tracking = await this.trackingService.getAllTracking();
    sendResponse(
      res,
      200,
      { tracking },
      "All tracking details retrieved successfully"
    );
  });

  // Delete a tracking record (admin only)
  deleteTracking = asyncHandler(async (req: Request, res: Response) => {
    const { trackingId } = req.params;

    const deletedTracking = await this.trackingService.deleteTracking(
      trackingId
    );
    sendResponse(
      res,
      200,
      { deletedTracking },
      "Tracking record deleted successfully"
    );
  });
}

export default TrackingDetailController;
