import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AppError from "../utils/AppError";
import PaymentService from "../services/paymentService";

class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Get all payments for the authenticated user
  getUserPayments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // From protect middleware
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const payments = await this.paymentService.getUserPayments(userId);
    sendResponse(res, 200, { payments }, "Payments retrieved successfully");
  });

  // Get details of a specific payment
  getPaymentDetails = asyncHandler(async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const payment = await this.paymentService.getPaymentDetails(
      paymentId,
      userId
    );
    sendResponse(
      res,
      200,
      { payment },
      "Payment details retrieved successfully"
    );
  });

  // Delete a payment (admin only)
  deletePayment = asyncHandler(async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    await this.paymentService.deletePayment(paymentId);
    sendResponse(res, 200, {}, "Payment deleted successfully");
  });
}

export default PaymentController;
