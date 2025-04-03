import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AppError from "../utils/AppError";
import OrderService from "../services/orderService";

class OrderController {
  constructor(private orderService: OrderService) {}

  // Get all orders for the authenticated user
  getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // From protect middleware
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const orders = await this.orderService.getUserOrders(userId);
    sendResponse(res, 200, { orders }, "Orders retrieved successfully");
  });

  // Get details of a specific order
  getOrderDetails = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const order = await this.orderService.getOrderDetails(orderId, userId);
    sendResponse(res, 200, { order }, "Order details retrieved successfully");
  });

  // Update tracking status (admin only)
  updateTrackingStatus = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) throw new AppError(400, "Tracking status is required");
    const userRole = req.user?.role; // From protect middleware
    if (!userRole) {
      throw new AppError(400, "User not found");
    }
    const tracking = await this.orderService.updateTrackingStatus(
      orderId,
      status,
      userRole
    );
    sendResponse(
      res,
      200,
      { tracking },
      "Tracking status updated successfully"
    );
  });
}

export default OrderController;
